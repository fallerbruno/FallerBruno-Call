import {
  Button,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@faller-bruno-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'usuário deve ter no mínimo 3 caracteres' })
    .max(20, { message: 'usuário deve ter no máximo 20 caracteres' })
    .regex(/([a-z\\-]+$)/i, {
      message: 'usuário deve conter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'nome deve ter no mínimo 3 caracteres' })
    .regex(/([a-z\\ ]+$)/i, {
      message: 'usuário deve conter apenas letras e hifens',
    }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  // pega o valor do username da url e seta no input
  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      const response = await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      toast.success(response.data.payload.message)
      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        toast.error(error.response.data.message)
      }
    }
  }

  return (
    <>
      <NextSeo
        title="Crie uma conta | Faller Bruno Call"
        description="Precisamos de algumas informações para criar seu perfil! Ah, você"
      />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={1} />
        </Header>
        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="fallerbruno.com/"
              placeholder="seu-usuário"
              {...register('username')}
            />
          </label>
          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
          <label>
            <Text size="sm">Nome de completo</Text>
            <TextInput placeholder="Seu Nome" {...register('name')} />
          </label>
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
