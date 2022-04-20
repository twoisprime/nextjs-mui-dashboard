import * as React from 'react';
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es';
import styled from "@emotion/styled";
import FormDialogCreateEvent from './FormDialogCreateEvent';
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import useUser from '@lib/useUser';
import useEvents from '@lib/useEvents';
import _ from 'lodash';

dayjs.extend(UTC) // use plugin

export const StyleWrapper = styled.div`

  .fc-toolbar-title {
    color: #ff3b30
  },

`

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
  const [openCreateEvent, setOpenCreateEvent] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(undefined);
  const { user, userLoading, userError } = useUser()
  const [parameters, setParameters] = React.useState({
    'start': null,
    'end': null
  });

  const { events, isLoading, isError } = useEvents(user, parameters)

  // if (isLoading) {
  //   console.log("loading events...")
  //   return null
  // }
  // if (isError) {
  //   console.log("error events")
  //   return null
  // }

  console.log(isLoading)
  console.log(events)

  // TODO: doesn't work with contentHeight auto
  const scrollTime = dayjs().format("HH") + ":00:00";

  const handleOpenCreateEvent = (arg) => {
    console.log(arg);
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

  // React.useEffect(() => {
  //   // main box component in dashboard layout
  //   const container = document.querySelector('main')

  //   const onScroll = () => {
  //     console.log("scroll!")
  //     setContentHeight('auto');
  //   }
  //   // clean up code
  //   container.removeEventListener('scroll', onScroll);
  //   container.addEventListener('scroll', onScroll);
  //   container.addEventListener('scroll', onScroll);
  //   return () => container.removeEventListener('scroll', onScroll);
  // }, []);

  return (
    <StyleWrapper>
      <FullCalendar
        locales={[esLocale]}
        locale={props.locale}
        plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin, listPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay'
        }}
        initialView='timeGridWeek'
        nowIndicator={true}
        selectable={true}
        longPressDelay={200}
        initialEvents={[
          { title: 'nice event', start: new Date() }
        ]}
        select={handleOpenCreateEvent}
        scrollTime={scrollTime}
        contentHeight={contentHeight}
        slotDuration='00:15:00'
        slotLabelInterval='00:15:00'
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }}
        events= {parseEvents(events)}
        eventTextColor='rgb(40,40,40)'
        datesSet={(dateInfo) => {
          handleParameters({
            'start': dayjs(dateInfo.startStr).utc().format(),  // UTC iso format
            'end': dayjs(dateInfo.endStr).utc().format()  //  UTC iso format
          })
        }}
      />
      <FormDialogCreateEvent 
        open={openCreateEvent}
        handleClose={handleCloseCreateEvent}>
      </FormDialogCreateEvent>
    </StyleWrapper>
  )
}