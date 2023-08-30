import { Button, Text, TextArea, TextInput } from '@faller-bruno-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'

const confirmFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome completo é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  observations: z.string().optional(),
})

type ConfirmFormValues = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onEndEvent: () => void
}

export function ConfirmStep({ schedulingDate, onEndEvent }: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmFormSchema),
  })

  const describeDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const descriveTime = dayjs(schedulingDate).format('HH:mm[h]')

  const router = useRouter()
  const username = String(router.query.username)

  async function handleConfirmScheduling(data: ConfirmFormValues) {
    const { name, email, observations } = data
    try {
      const response = await api.post(`/users/${username}/schedule`, {
        name,
        email,
        observations,
        date: schedulingDate,
      })

      if (response.status === 201) {
        toast.success(response.data.message)
        onEndEvent()
      }
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        toast.error(error.response.data.message)
      }
    }
  }

  useEffect(() => {
    if (errors.name) {
      toast.error(errors.name?.message)
    }

    if (errors.email) {
      toast.error(errors.email?.message)
    }
  }, [errors.email, errors.name])

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describeDate}
        </Text>
        <Text>
          <Clock />
          {descriveTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        {errors.name && (
          <FormError size="sm">{errors.email?.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onEndEvent}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={handleConfirmScheduling}
        >
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
