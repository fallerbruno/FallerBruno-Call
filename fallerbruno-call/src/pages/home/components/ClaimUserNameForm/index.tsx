import { Button, Text, TextInput } from '@faller-bruno-ui/react'
import { Form, FormAnnotation } from './styles'
import { ArrowRight } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const claimUserNameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'usuário deve ter no mínimo 3 caracteres' })
    .max(20, { message: 'usuário deve ter no máximo 20 caracteres' })
    .regex(/([a-z\\-]+$)/i, {
      message: 'usuário deve conter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
  // Regex que define que so podem letras e hifens
})

type ClaimUserNameFormData = z.infer<typeof claimUserNameFormSchema>

export function ClaimUserNameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUserNameFormData>({
    resolver: zodResolver(claimUserNameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUserNameFormData) {
    const { username } = data

    toast.success(
      'Usuário reservado com sucesso! Você será redirecionado para a página de registro.',
    )

    setTimeout(async () => {
      await router.push(`/register?username=${username}`)
    }, 2000)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="fallerbruno.com/"
          placeholder="seu-usuário"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário desejado'}
        </Text>
      </FormAnnotation>
    </>
  )
}
