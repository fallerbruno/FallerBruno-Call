import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
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

  const { bio } = updateProfileBodySchema.parse(req.body)
  // correto seria rodar com createMany, mas não está funcionando no sqlite, para outros bancos é suportado
  // await prisma.userTimeInterval.createMany({})

  await prisma.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      bio,
    },
  })

  /* segundo o CQRS - Command / Query -> para comandos não é necessário retornar nada, apenas um status 201 
    sempre retornar dados para querys
  */

  return res.status(200).json({ message: 'Perfil atualizado com sucesso' })
}
