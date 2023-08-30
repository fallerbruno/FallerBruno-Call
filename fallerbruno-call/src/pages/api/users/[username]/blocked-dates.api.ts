/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  //   http://localhost:3000/api/users/bruno/blocked-dates?date=2021-10-10

  if (!year || !month) {
    return res.status(400).json({ message: 'Missing parameters' })
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const avaliableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !avaliableWeekDays.some((availableWeekDay) => {
      return availableWeekDay.week_day === weekDay
    })
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
  SELECT 
    EXTRACT(DAY FROM schedulings.date) AS date, 
    COUNT(schedulings.date) AS amount,
   ((user_time_intervals.end_time_in_minutes - user_time_intervals.start_time_in_minutes ) / 30 ) AS size

  FROM schedulings
                                    
  LEFT JOIN user_time_intervals
  -- adiciona mais 1 pq no banco o dia da semana começa em 1 e no js em 0
    on user_time_intervals.week_day = WEEKDAY(DATE_ADD(schedulings.date, INTERVAL 1 DAY))

  WHERE schedulings.user_id = ${user.id}
  -- extrai os valores pq com DATE_FORMAT estava travando
    AND EXTRACT(YEAR from schedulings.date) = ${year}
    AND EXTRACT(MONTH from schedulings.date) = ${month}

    GROUP BY EXTRACT(DAY from schedulings.date),
      ((user_time_intervals.end_time_in_minutes -user_time_intervals.start_time_in_minutes ) / 30 )

      HAVING amount >= size
  `

  const blockedDates = blockedDatesRaw.map((blockedDate) => blockedDate.date)

  return res.json({ blockedWeekDays, blockedDates })
}
