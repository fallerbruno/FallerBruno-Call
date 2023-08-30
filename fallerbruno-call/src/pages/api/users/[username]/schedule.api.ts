/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import { getGoogleOauthToken } from '@/lib/google'
import { google } from 'googleapis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const username = String(req.query.username)

  const creatingSchedulingBodySchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    observations: z.string().optional(),
    date: z.string().datetime(),
  })

  //   http://localhost:3000/api/users/bruno/availability?date=2021-10-10

  if (!username) {
    return res.status(400).json({ message: 'Missing parameters' })
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const { name, email, observations, date } =
    creatingSchedulingBodySchema.parse(req.body)

  const schedulingDate = dayjs(date)
  const schedulingDateMinutes = schedulingDate.get('minute')

  if (+schedulingDateMinutes % 1 !== 0) {
    schedulingDate.set('minutes', 30)
  } else {
    schedulingDate.set('minutes', 0)
  }

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({ message: 'Invalid date' })
  }

  const conflictScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictScheduling) {
    return res.status(400).json({ message: 'Invalid date' })
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observation: observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOauthToken(user.id),
  })

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Fallerbruno call ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(30, 'minute').format(),
      },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201).json({ message: 'Horário marcado com sucesso' })
}
