/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const username = String(req.query.username)
  const { date } = req.query

  //   http://localhost:3000/api/users/bruno/availability?date=2021-10-10

  if (!username || !date) {
    return res.status(400).json({ message: 'Missing parameters' })
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const referenceDate = dayjs(date as string)

  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.status(400).json({
      available: [],
      possibleTimes: [],
      message: 'Past dates are not allowed',
    })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: dayjs(referenceDate).day(),
    },
  })

  if (!userAvailability) {
    return res.status(200).json({
      available: [],
      possibleTimes: [],
      message: 'Dates are not allowed',
    })
  }

  const { start_time_in_minutes, end_time_in_minutes } = userAvailability

  const startHour = start_time_in_minutes / 60

  const endHour = end_time_in_minutes / 60

  const arrayOfHours = Array.from({
    length: (endHour - startHour) * 2,
  }).map((_, index) => index / 2 + startHour)

  // grater than or equal to = gte
  // less than or equal to = lte

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = arrayOfHours.filter((time) => {
    const isTimeBlocked = !blockedTimes.some(
      (blockedTime) =>
        blockedTime.date.getHours() === time ||
        blockedTime.date.getHours() + 0.5 === time,
    )

    const isTimeInPast =
      referenceDate.set('hour', time).isBefore(new Date()) &&
      referenceDate.set('minutes', time).isBefore(new Date())

    return isTimeBlocked && !isTimeInPast
  })

  return res.status(200).json({ availableTimes, arrayOfHours })
}
