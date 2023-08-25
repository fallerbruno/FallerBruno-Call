import {
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@faller-bruno-ui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type updateProfileData = z.infer<typeof updateProfileSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<updateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()
  console.log(session)

  async function handleUpdateProfile(data: updateProfileData) {
    console.log(data)
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>
        <MultiStep size={4} currentStep={4} />
      </Header>
      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Foto de Perfil</Text>
        </label>

        <label>
          <Text size="sm">Sobre Você</Text>
          <TextArea {...register('bio')} />
          <FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sessionServer = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  const user = {
    ...sessionServer?.user,
    created_at: sessionServer?.user.created_at.toISOString(), // Convert Date to ISO string
    updated_at: sessionServer?.user.updated_at.toISOString(), // Convert Date to ISO string
  }

  const session = {
    expires: sessionServer?.expires,
    user,
  }

  return {
    props: {
      session,
    },
  }
}
