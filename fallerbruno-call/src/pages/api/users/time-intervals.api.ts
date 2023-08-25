import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body)
  console.log(intervals)
  // correto seria rodar com createMany, mas não está funcionando no sqlite, para outros bancos é suportado
  // await prisma.userTimeInterval.createMany({})

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          start_time_in_minutes: interval.startTimeInMinutes,
          end_time_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      })
    }),
  )

  /* segundo o CQRS - Command / Query -> para comandos não é necessário retornar nada, apenas um status 201 
    sempre retornar dados para querys
  */

  return res.status(201).end()
}
