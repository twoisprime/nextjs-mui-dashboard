import * as React from 'react';
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es';
import styled from "@emotion/styled";
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import FormDialogCreateEvent from './FormDialogCreateEvent';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import useTranslation from 'next-translate/useTranslation'
import useUser from '@lib/useUser';
import useEvents from '@lib/useEvents';
import useUsers from '@lib/useUsers';
import useCustomers from '@lib/useCustomers';
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import _ from 'lodash';

dayjs.extend(UTC) // use plugin

export const StyleWrapper = styled.div`

  .fc-toolbar-title {
    color: #ff3b30
  },

  .fc .fc-userSelect-button {
    background-color: #ff3b30
  }

`

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function json_event2calendar(event) {
  // console.log("server: " + event.start)
  // console.log("UTC: " + dayjs.utc(event.start).format())
  let startStr = dayjs.utc(event.start).local().format();  // UTC time to local
  let endStr = dayjs.utc(event.end).local().format();  // UTC time to local
  // console.log("local: " + startStr)
  // console.log(endStr)
  let title;
  let event_modal_title;
  if (event.display === "background") {
      title = "Bloqueado";
      event_modal_title = "Bloqueado";
  } else {
      title = event.service.customer.name + ' - ' + event.service.service_type.name;
      event_modal_title = event.service.customer.name;
  };
  return {
      id: event.id,
      // title: event.title,
      title: title,
      start: startStr,  // event.start,
      end: endStr,  // event.end,
      startStr: startStr,
      endStr: endStr,
      allDay: event.all_day,
      url: event.url,
      backgroundColor: event.background_color,
      borderColor: event.background_color,  // event.border_color, border_color afecta month view
      display: event.display,  // background events
      extendedProps: {
          name: event.name,
          comment: event.comment,
          service_id: event.service_id,
          event_modal_title: event_modal_title
      }
  };
};

const parseEvents = (events) => {

  if (events) {
  
    let mappedEvents = events.map(function(v) {
        let event = v[0];
        event.service = {
            status: v[1],
            customer: {
                name: v[2]
            },
            service_type: {
                name: v[3]
            }
        };
        return event;
    });

    // filter events that have been cancelled
    let filteredEvents = _.filter(mappedEvents, function(o) {
        return(o.service.status !== 'Anulado');
    });

    return filteredEvents.map(json_event2calendar)

  } else {
    return []
  }

}

export default (props) => {
  const router = useRouter()
  const { t, lang } = useTranslation('common')
  const [openCreateEvent, setOpenCreateEvent] = React.useState(false);
  const [openEvent, setOpenEvent] = React.useState(false);
  const [eventSelection, setEventSelection] = React.useState(null);
  const [openAlert, setOpenAlert] = React.useState(true); // allow opening alerts
  const [professional, setProfessional] = React.useState(null);
  // const [contentHeight, setContentHeight] = React.useState(undefined);
  // const [visibility, setVisibility] = React.useState(false);
  // const [skeleton, setSkeleton] = React.useState(true);
  // const router = useRouter();
  // const [loading, setLoading] = React.useState(false);
  
  // popover to select user
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [parameters, setParameters] = React.useState({
    'start': null,
    'end': null
  });

  const calendarRef = React.useRef()

  const { user } = useUser()
  const { users } = useUsers({
    'active': true,
    'role': 'professional'
  })
  const { events, isLoading, isError, isAuthorized } = useEvents(professional, parameters)

  if (!isAuthorized)
      router.push('/login')

  if (isLoading)
      NProgress.start()
  else
      NProgress.done()

  // TODO: doesn't work with contentHeight auto
  const scrollTime = dayjs().format("HH") + ":00:00";

  const userOptions = users ? users : []

  const defaultProps = {
    options: userOptions,
    getOptionLabel: (option) => option.name,
  };

  const handleOpenCreateEvent = ({allDay, startStr, endStr}) => {
    setEventSelection({
      'allDay': allDay,
      'startStr': startStr,
      'endStr': endStr
    });
    setOpenCreateEvent(true);
  };

  const handleCloseCreateEvent = () => {
    setOpenCreateEvent(false);
  };

  const handleParameters = (params) => {
    const {start, end} = params
    if (start !== parameters.start || end !== parameters.end)
      setParameters({
        'start': start,
        'end': end
      })
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorEl(null);
  };

  const handleUserSelect = (event, value, reason) => {
    handleUserClose();
    setProfessional(value);
  };

  React.useEffect(() => {
    setOpenAlert(true);
  }, [isError]);

  React.useEffect(() => {
    if (user && users) {
      // try to get professional from props, from current user, or set default
      const currentProfessional = _.find(users, {'id': props.professionalID ? props.professionalID : user.id})
      setProfessional(currentProfessional ? currentProfessional : users[0])  // default professional
    }
  }, [user, users]);

  return (
    <StyleWrapper>
      <FullCalendar
        ref={calendarRef}
        locales={[esLocale]}
        locale={props.locale}
        plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin, listPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          // right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay'
          right: 'dayGridMonth,timeGridWeek,listDay userSelect'
        }}
        initialView='timeGridWeek'
        nowIndicator={true}
        selectable={true}
        // longPressDelay={200}
        // windowResizeDelay={500}
        select={handleOpenCreateEvent}
        // dateClick={handleOpenCreateEvent}
        scrollTime={scrollTime}
        contentHeight={'auto'}  // {contentHeight}
        // height={'100vh'}
        // aspectRatio={'2'}
        // stickyHeaderDates={true}
        slotDuration='00:15:00'
        slotLabelInterval='00:15:00'
        slotMinTime='05:00:00'
        slotMaxTime='23:59:59'
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }}
        events= {parseEvents(events)}
        eventTextColor='rgb(40,40,40)'
        eventClick={(info) => {
          info.jsEvent.preventDefault(); // don't let the browser navigate
          // open_event_modal(info.event);
        }}
        datesSet={(dateInfo) => {
          handleParameters({
            'start': dayjs(dateInfo.startStr).utc().format(),  // UTC iso format
            'end': dayjs(dateInfo.endStr).utc().format()  //  UTC iso format
          })
        }}
        customButtons={{
          userSelect: {
            text: professional ? professional.name : 'loading...',
            click: function(event) {
              handleUserClick(event);
            }
        }}}
      />
      <FormDialogCreateEvent 
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0
        }}
        open={openCreateEvent}
        handleClose={handleCloseCreateEvent}
        eventSelection={eventSelection}
        professional={professional}
      >
      </FormDialogCreateEvent>
      <Popover
        sx={{mt: 1}}
        open={open}
        anchorEl={anchorEl}
        onClose={handleUserClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Autocomplete
          {...defaultProps}
          sx={{
            m: 1,
            width: 200
          }}
          defaultValue={professional}
          autoSelect={true}
          disableClearable={true}
          renderInput={(params) => (
            <TextField {...params} label={t('User')} />
          )}
          onChange={handleUserSelect}
          value={professional}
        />
      </Popover>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={isError && openAlert}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity="error">
          Error while loading data
        </Alert>
      </Snackbar>
    </StyleWrapper>
  )
}