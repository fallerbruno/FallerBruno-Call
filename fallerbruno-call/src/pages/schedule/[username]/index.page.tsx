import { Avatar, Heading, Text } from '@faller-bruno-ui/react'
import { Container, UserHeader } from './styles'
import { GetStaticPaths, GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { SchedureForm } from './SchedureForm'
import { NextSeo } from 'next-seo'

interface SchedureProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: SchedureProps) {
  return (
    <>
      <NextSeo
        title={`Agendar com ${user.name} | Faller Bruno Call`}
        description={`Agende uma reunião com o ${user.name}`}
      />
      <Container>
        <UserHeader>
          <Avatar src={user?.avatarUrl} alt="Foto de Perfil" />
          <Heading>{user?.name}</Heading>
          <Text>{user?.bio}</Text>
        </UserHeader>

        <SchedureForm />
      </Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  // como estamos no server side consigo fazer a chamada ao banco de dados
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
