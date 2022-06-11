import * as React from 'react';
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
import useCustomers from '@lib/useCustomers';
import useServiceTypes from '@lib/useServiceTypes';
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(UTC)
dayjs.extend(customParseFormat)

export default function FormDialogCreateEvent({open, handleClose, eventSelection}) {
  const { t, lang } = useTranslation('common')
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  // console.log(eventSelection);

  const renderDate = (props) => {
    // console.log(props)
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

  console.log(services)

  const filter = createFilterOptions();

  React.useEffect(() => {
    setStartDate(eventSelection ? eventSelection.startStr : null);
    setEndDate(eventSelection ? eventSelection.endStr : null);
  }, [eventSelection]);

  return (
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Create Event</DialogTitle>
    <DialogContent>
      <Stack spacing={3}>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
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
            <TextField {...params} label={t('Customer')} />
          )}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          freeSolo
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
    <DialogActions>
        <Button onClick={handleClose}>Close</Button>
    </DialogActions>
    </Dialog>
  );
}
