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
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

interface AvailabilityItem {
  arrayOfHours: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const username = String(router.query.username)

  const hasSelectedDate = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const monthDay = selectedDate
    ? dayjs(selectedDate).format('DD [ de ] MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).startOf('day').toDate()
    : null

  // consigo pegar isLoading e outros parametros

  const { data: availability } = useQuery<AvailabilityItem>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      // so vai executar se tem 1 selectedDate
      enabled: !!selectedDate,
    },
  )

  function formatDate(date: number) {
    if (date % 1 !== 0) {
      return String(date).split('.')[0].padStart(2, '0').concat(':30h')
    } else {
      return String(date).padStart(2, '0').concat(':00h')
    }
  }

  function handleSelectTime(hour: number) {
    if (hour % 1 !== 0) {
      const dateWithTime = dayjs(selectedDate)
        .set('hour', hour)
        .set('minutes', 30)
        .toDate()

      onSelectDateTime(dateWithTime)
    } else {
      const dateWithTime = dayjs(selectedDate)
        .set('hour', hour)
        .startOf('hour')
        .toDate()

      onSelectDateTime(dateWithTime)
    }
  }

  return (
    <Container isTimePickerOpen={hasSelectedDate}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      {hasSelectedDate && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{monthDay}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.arrayOfHours?.map((hour) => (
              <TimePickerItem
                key={hour}
                disabled={!availability.availableTimes.includes(hour)}
                onClick={() => handleSelectTime(hour)}
              >
                {formatDate(hour)}
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
