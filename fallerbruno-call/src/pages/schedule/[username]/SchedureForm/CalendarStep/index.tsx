import { useState } from 'react'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import { Calendar } from '@/components/Calendar'
import dayjs from 'dayjs'

export function CalendarStep() {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const hasSelectedDate = false

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  return (
    <Container isTimePickerOpen={hasSelectedDate}>
      <Calendar />
      {hasSelectedDate && (
        <TimePicker>
          <TimePickerHeader>
            {currentMonth} <span>{currentYear}</span>
          </TimePickerHeader>
          <TimePickerList>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>09:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
