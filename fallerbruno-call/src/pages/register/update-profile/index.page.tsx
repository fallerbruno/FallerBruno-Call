import {
  Avatar,
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
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type updateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<updateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()

  const navigate = useRouter()

  async function handleUpdateProfile(data: updateProfileData) {
    try {
      const response = await api.put('/users/update-profile', {
        bio: data.bio,
      })

      console.log(response)

      toast.success(response.data.message)

      await navigate.push(`schedule/${session?.data?.user.username}`)
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError && error?.response?.data?.message) {
        toast.error(error.response.data.message)
      }
    }
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
          <Avatar src={session.data?.user.avatar_url} alt="Foto do usuário" />
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
