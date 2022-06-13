import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';

import useService from '@lib/useService';
import { toCurrencyFormat } from '@lib/money';
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import _ from 'lodash';

dayjs.extend(UTC)
dayjs.extend(customParseFormat)

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DialogEvent({open, handleClose, event, professional}) {
  const { t, lang } = useTranslation('common')
  // const [loadingSave, setLoadingSave] = React.useState(false);
  const [value, setValue] = React.useState(0);

  // popover to confirm delete
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openConfirm = Boolean(anchorEl);

  const { service } = useService(event ? event.extendedProps.service_id : null)

  let total;
  let discount;
  let pending_payment;
  if (service) {
    if (service.price === null) {
      // reference price
      total = service.service_type.price;
      discount = '0%';
      pending_payment = service.service_type.price - _.sumBy(service.payments, 'amount');
    } else {
      // actual service price (has discount)
      total = service.price;
      discount = _.toString(_.toSafeInteger(100 - service.price*100/service.service_type.price)) + '%';
      pending_payment = service.price - _.sumBy(service.payments, 'amount');
    }
  }

  const getDateDisplay = (event) => {
    // is it a background event?
    let background = false;
    if (event.display === "background") {
        background = true;
    };

    let start_datetime = dayjs(event.startStr);

    // all-day events have endStr = ""
    if (event.allDay) {
        var date_display = start_datetime.format('dddd, D MMMM');
    } else {
        let end_datetime = dayjs(event.endStr);
        // check if event falls within the same day
        if (start_datetime.month() ===  end_datetime.month() && start_datetime.date() ===  end_datetime.date()) {
            var date_display = start_datetime.format('dddd, D MMMM') + ' ⋅ ' + start_datetime.format('HH:mm') + ' - ' + end_datetime.format('HH:mm');
        } else {
            var date_display = start_datetime.format('D MMMM YYYY, HH:mm') + ' - ' + end_datetime.format('D MMMM YYYY, HH:mm');
        };
    };
    // console.log("DATE_DISPLAY: " + date_display);
    return date_display;
  };

  const handleDelete = () => {
    const params = new URLSearchParams({
        'serviceID': service.id
      }).toString()

    fetch(`/api/service?${params}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .then((responseJson) => {
      // Do something with the response
      handleClose("success")
    })
    .catch((error) => {
      handleClose("error")
    });

  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleConfirmOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConfirmClose = () => {
    setAnchorEl(null);
  };

  const handleConfirm = () => {
    handleConfirmClose()
    handleDelete()
  };

  React.useEffect(() => {
    setValue(0);
  }, [service]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle>
        <Typography component="div" variant="h5" mb={2}>
          {event ? event.title : 'Loading...'}
        </Typography>
        <Stack direction="row" spacing={0} 
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}>
          <IconButton
            aria-label="delete"
            onClick={handleConfirmOpen}
            sx={{
              // color: (theme) => theme.palette.grey[500],
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              // color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label="Payments" {...a11yProps(1)} />
            <Tab label="Notes" {...a11yProps(2)} />
          </Tabs>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          height: '350px'
        }}
      >
        <Stack spacing={3}>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <Box sx={{ width: '100%' }}>
            <TabPanel value={value} index={0}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={event ? getDateDisplay(event) : ''}
                    secondary={'Date'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={service ? service.status : ''}
                    secondary={'Status'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PaidIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={pending_payment ? toCurrencyFormat(pending_payment) : ''}
                    secondary={'Pending'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={professional ? professional.name : ''}
                    secondary={'Professional'}
                  />
                </ListItem>
              </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={event ? getDateDisplay(event) : ''}
                    secondary={'Date'}
                  />
                </ListItem>
              </List>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={event ? getDateDisplay(event) : ''}
                    secondary={'Date'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={service ? service.status : ''}
                    secondary={'Status'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PaidIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={pending_payment ? toCurrencyFormat(pending_payment) : ''}
                    secondary={'Pending'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={professional ? professional.name : ''}
                    secondary={'Professional'}
                  />
                </ListItem>
              </List>
            </TabPanel>
          </Box>
        </Stack>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions> */}
      <Popover
        open={openConfirm}
        anchorEl={anchorEl}
        onClose={handleConfirmClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Button onClick={handleConfirm}>{t('Confirm')}</Button>
      </Popover>
    </Dialog>
  );
}
