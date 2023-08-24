import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userAlreadyExists) {
    return res.status(400).json({
      message: 'Usuário já existe',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  const payload = {
    payload: {
      data: user,
      message: 'Usuário criado com sucesso',
    },
  }

  // NOOKIES -> Deve setar com o res do NextApiRequest
  setCookie({ res }, '@fallerbrunocall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/', // todas as rotas da aplicação
  })

  return res.status(201).json(payload)
}
