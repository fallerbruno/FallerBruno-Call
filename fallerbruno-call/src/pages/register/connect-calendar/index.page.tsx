import { Button, Heading, MultiStep, Text } from '@faller-bruno-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { signIn, useSession } from 'next-auth/react'
import { Container, Header } from '../styles'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  async function handleConnectCalendar() {
    // signIn é um método do next-auth que permite fazer login com um provider
    // rescrevemos o signIn para se adaptar ao nosso projeto
    // api auth [...nextauth].api.ts tem mais detalhes
    // lib auth/prisma-adapter.ts tem mais detalhes
    await signIn('google')
  }
  useEffect(() => {
    if (hasAuthError) {
      toast.error('Não foi possível conectar com o Google Calendar')
    }
    if (isSignedIn) {
      toast.success(
        'Conectado com sucesso, agora você pode prosseguir para o próximo passo',
      )
    }
  }, [hasAuthError, isSignedIn])

  function handleNextSetp() {
    router.push('/register/time-intervals')
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>
        <MultiStep size={4} currentStep={2} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>

          {isSignedIn ? (
            <Button size="sm" disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button size="sm" onClick={handleConnectCalendar}>
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            Falha ao se conectar com o Google Calendar, verifique se você
            habilitou as permissões de acesso.
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn} onClick={handleNextSetp}>
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
