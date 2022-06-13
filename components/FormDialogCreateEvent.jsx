import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import useCustomers from '@lib/useCustomers';
import useServiceTypes from '@lib/useServiceTypes';
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(UTC)
dayjs.extend(customParseFormat)

// TODO find alternative to uuid tags
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

export default function FormDialogCreateEvent({open, handleClose, eventSelection, professional}) {
  const { t, lang } = useTranslation('common')
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [customer, setCustomer] = React.useState(null);
  const [service, setService] = React.useState(null);
  const [loadingSave, setLoadingSave] = React.useState(false);

  const handleSave = () => {
    setLoadingSave(true)

    let eventJSON = {
      "title": customer.name,  // used for schema compliance but now customer name is used directly (except for blocked event)
      "start": startDate,
      "end": endDate,
      "all_day": false,
      "background_color": "#b3e0ff",  // 85% lighter/darker ()
      "border_color": "#b3e0ff"  // "rgb(40,40,40)"
    };

    // TODO decide what to do with tag (uuid good solution?)
    let serviceJSON = {
      "tag": uuidv4(),
      "priority": 0,
      "status": "Agendado",
      "is_active": true,  // default
      "customer_id": customer.id,
      "service_type_id": service.id,
      "user_id": professional.id,
      "events": [eventJSON]
    };

    fetch('/api/service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceJSON),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .then((responseJson) => {
      // Do something with the response
      setLoadingSave(false)
      handleClose("success")
    })
    .catch((error) => {
      setLoadingSave(false)
      handleClose("error")
    });
  }

  const renderDate = (props) => {
    const dateFormat = dayjs().format('dddd, D MMMM HH:mm')
    if (props.label === t('Start')) {
      dateFormat = dayjs(startDate).format('dddd, D MMMM HH:mm')
    } else if (props.label === t('End')) {
      dateFormat = dayjs(endDate).format('dddd, D MMMM HH:mm')
    }
    props.inputProps.value = dateFormat
    return <TextField {...props} />
  }

  const { customers } = useCustomers({
    'active': true
  })

  const { services } = useServiceTypes({
    'active': true
  })

  const customerOptions = customers ? customers : []
  const serviceOptions = services ? services : []

  const filter = createFilterOptions();

  React.useEffect(() => {
    setStartDate(eventSelection ? eventSelection.startStr : null);
    setEndDate(eventSelection ? eventSelection.endStr : null);
  }, [eventSelection]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle>
        <Typography component="div" variant="h5" m={1}>
          {t('Create') + ' ' + t('Appointment')}
        </Typography>
        
        <Stack direction="row" spacing={0} m={1}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} m={1}>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <Autocomplete
            options={customerOptions}
            autoComplete
            includeInputInList
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label={t('Customer')}
                id="customer"
                name="customer"
              />
            )}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            onChange={(event, value, reason) => {
              setCustomer(value);
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              if (params.inputValue !== '') {
                filtered.push({
                  inputValue: params.inputValue,
                  id: 'unique-id',
                  name: `${t('Add')} "${params.inputValue}"`,
                });
              }
              return filtered;
            }}
            getOptionLabel={(option) => {
              // e.g value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
          />
          <Autocomplete
            options={serviceOptions}
            autoComplete
            includeInputInList
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('Service')} />
            )}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            onChange={(event, value, reason) => {
              setService(value);
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              if (params.inputValue !== '') {
                filtered.push({
                  inputValue: params.inputValue,
                  id: 'unique-id',
                  name: `${t('Add')} "${params.inputValue}"`,
                });
              }
              return filtered;
            }}
            getOptionLabel={(option) => {
              // e.g value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
          />
          <DateTimePicker
            renderInput={renderDate}
            label={t('Start')}
            value={startDate}
            ampm={false}
            onChange={(newStartDate, keyboardInputValue) => {
              if (keyboardInputValue === undefined) {
                let diff = newStartDate.diff(startDate, 'minute');
                let newEndDate = dayjs(endDate);
                if (diff > 0) {
                    newEndDate = newEndDate.add(diff, 'minute');
                } else {
                    newEndDate = newEndDate.subtract(-diff, 'minute');
                };
                setStartDate(newStartDate);
                setEndDate(newEndDate)
              }
            }}
            minutesStep={5}
            InputProps={{ readOnly: true }}
            // shouldDisableTime={(timeValue, clockType) => {
            //   if (clockType === 'minutes' && timeValue % 5) {
            //     return true;
            //   }
            //   return false;
            // }}
          />
          <DateTimePicker
            renderInput={renderDate}
            label={t('End')}
            value={endDate}
            ampm={false}
            minDateTime={dayjs(startDate)}
            onChange={(newEndDate, keyboardInputValue) => {
              if (keyboardInputValue === undefined) {
                let duration = newEndDate.diff(startDate, 'minute');
                if (duration >= 0) {  // allow valid range only
                    setEndDate(newEndDate);
                }
              }
            }}
            minutesStep={5}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          mb: 2
        }}
      >
        <LoadingButton
          color="secondary"
          loading={loadingSave}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          onClick={handleSave}
        >
          Save
        </LoadingButton>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
