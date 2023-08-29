import { CaretLeft, CaretRight } from 'phosphor-react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'
import { getWeekDays } from '@/utils/getWeekDays'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate?: Date | undefined | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const shortWeekDays = getWeekDays({ short: true })

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const firstWeekDay = currentDate.get('day')

  const calendarWeeks = useMemo(() => {
    // pega os dias do mês atual
    const daysInMonth = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => {
      return currentDate.set('date', index + 1)
    })

    // pega os dias do mês anterior
    const previousMonthDays = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => {
        return currentDate.subtract(firstWeekDay - index, 'day')
      })
      .reverse()

    // pega os dias do próximo mês
    const nextMonthDays = Array.from({
      length: 7 - ((daysInMonth.length + previousMonthDays.length) % 7),
    }).map((_, index) => {
      return currentDate.add(index, 'day')
    })

    // junta todos os dias em um único array e adiciona as propriedades
    const calendarDays = [
      ...previousMonthDays.map((date) => {
        return { date, disabled: true }
      }),

      ...daysInMonth.map((date) => {
        return { date, disabled: date.endOf('day').isBefore(dayjs()) }
      }),

      ...nextMonthDays.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        /*  weeks é cada interação do reduce
        /   _ é o valor atual que consta dentro de cada posição do array
        /   index é o index atual da interação
        /   original é o array original que está sendo iterado
        */

        // se o index for divisível por 7, é uma nova semana
        if (index % 7 === 0) {
          // se for uma nova semana, adiciona uma nova semana no array
          // e adiciona o dia atual de cada interação
          weeks.push({
            week: weeks.length + 1,
            days: original.slice(index, index + 7),
          })
        }

        return weeks
      },
      [],
    )

    // retorna o array de semanas
    return calendarWeeks
  }, [currentDate, firstWeekDay])

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')

    setCurrentDate(nextMonthDate)
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous Month">
            <CaretLeft size={24} />
          </button>
          <button onClick={handleNextMonth} title="Next Month">
            <CaretRight size={24} />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((day) => (
              <th key={day}>{day}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.format('DD/MM/YYYY')}>
                  <CalendarDay
                    onClick={() => {
                      onDateSelected(date.toDate())
                    }}
                    disabled={disabled}
                  >
                    {date.format('DD')}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
