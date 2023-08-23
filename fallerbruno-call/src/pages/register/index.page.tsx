import {
  Button,
  Heading,
  MultiStep,
  Text,
  TextInput,
  Tooltip,
} from "@faller-bruno-ui/react";
import { Container, Form, Header } from "./styles";
import { ArrowRight } from "phosphor-react";

export default function Register() {
  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>
      <Form as="form">
        <Tooltip content="Seu Nome de Usuário na aplicação">
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput prefix="fallerbruno.com/" placeholder="seu-usuário" />
          </label>
        </Tooltip>
        <Tooltip content="Seu Nome de Usuário na aplicação">
          <label>
            <Text size="sm">Nome de completo</Text>
            <TextInput placeholder="Seu Nome" />
          </label>
        </Tooltip>
        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
