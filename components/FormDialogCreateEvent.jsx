import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';


export default function FormDialogCreateEvent({open, handleClose}) {
  const [value, setValue] = React.useState(new Date());

  const options = [
    { label: 'The Godfather', id: 1 },
    { label: 'Pulp Fiction', id: 2 },
  ];

  const defaultProps = {
    options: options,
    getOptionLabel: (option) => option.label,
  };

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
          {...defaultProps}
          id="auto-complete"
          autoComplete
          includeInputInList
          renderInput={(params) => (
            <TextField {...params} label="autoComplete" />
          )}
        />
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="DateTimePicker"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
        />
      </Stack>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClose}>Close</Button>
    </DialogActions>
    </Dialog>
  );
}
