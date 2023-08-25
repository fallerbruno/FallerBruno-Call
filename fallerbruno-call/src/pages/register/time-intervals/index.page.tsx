import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@faller-bruno-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Container, Header } from '../styles'
import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '@/utils/getWeekDays'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { api } from '@/lib/axios'

/*  entendo melhor o zod
validamos as propriedades como estamos acostumados, mas o zod nos permite fazer mais coisas
no exemplo abaixo, estamos definindo que o array de intervals deve ter 7 itens, e que cada item deve ter as propriedades weekDay, enabled, startTime e endTime
depois usamos a técnica de transform para filtrar os itens que não estão habilitados
e por fim usamos o refine para garantir que pelo menos um item esteja habilitado
o refine recebe nosso objeto e retorna um boolean, se o retorno for false, o zod lança um erro
Zod consegue transformar os dados.
*/

const timeIntervalFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'É necessário selecionar pelo menos um dia da semana',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 > interval.startTimeInMinutes,
        )
      },
      {
        message: 'O horário final deve ser pelo menos 1h distante do início',
      },
    ),
})

// dados originais do formulário
type TimeIntervalsFormInput = z.input<typeof timeIntervalFormSchema>

// dados que serão enviados para a api transformados pelo zod
type TimeIntervalsFormOutput = z.output<typeof timeIntervalFormSchema>

/*  useForm aceita 3 tipagens, input, context, output
/   input: dados originais do formulário
/   context: dados que serão compartilhados entre os inputs
/   output: dados que serão enviados para a api */

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput, any, TimeIntervalsFormOutput>({
    resolver: zodResolver(timeIntervalFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  // o useFieldArray é um hook que permite manipular um array de inputs
  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  // o watch é um hook que permite observar o valor de um input
  const intervals = watch('intervals')

  // o getWeekDays é uma função que retorna um array com os dias da semana
  const weekDays = getWeekDays()

  async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
    await api.post('/users/time-intervals', data)
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>
      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalsContainer>
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                {/* transformamos o checkbox em um elemento controller e fazer a manipulação do mesmo dentro dele e usando a prop render para mostrar em nela  */}
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Checkbox
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked === true)
                        }}
                        checked={field.value}
                      />
                    )
                  }}
                />
                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDay>

              {/* utilizamos o hook watch para desabilitar os inputs quando o checked estiver desmarcado */}
              <IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={30}
                  {...register(`intervals.${index}.startTime`)}
                  disabled={!intervals[index].enabled}
                />
                <TextInput
                  size="sm"
                  type="time"
                  step={30}
                  {...register(`intervals.${index}.endTime`)}
                  disabled={!intervals[index].enabled}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalsContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
