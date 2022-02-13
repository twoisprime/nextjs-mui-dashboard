import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es';
import styled from "@emotion/styled";


export const StyleWrapper = styled.div`
  .fc-toolbar-title {
    color: #ff3b30
  } 
`

export default (props) => {
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
        editable={true}
        selectable={true}
        initialEvents={[
          { title: 'nice event', start: new Date() }
        ]}
      />
    </StyleWrapper>
  )
}