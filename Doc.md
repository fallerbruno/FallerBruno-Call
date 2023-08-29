## CRIAR PROJETO

## LIBS

NODEJS, NEXTJS, TYPESCRIPT, REACT, LINT, FALLERBRUNOUI, PHOSPHOR-REACT, TOASTIFY, HOOKFORM, ZOD, PRISMA, AXIOS, NOOKIES,
PROTOCOLO OAUTH, NEXTAUTH, @tanstack/react-query, DayJs,

OAUTH para EXPRESS Passport
MAGIC LINK

npx create-next-app@latest --use-npm

## REALIZAR LIMPEZA DO PROJETO

## INSTALAR LIB QUE CRIAMOS

instalação do fallerbruno-ui -> npm i @faller-bruno-ui/react@latest

## CRIAR E CONFIGURAR O DOCUMENT

criação do document.tsx

## CRIAR OS ESTILOS GLOBAIS

styles-> global.ts

## INSTALAR ESLINT

npm i @rocketseat/eslint-config -D

## CHECKAR OS ERROS DE LINT

npm run lint

## ARRUMAR OS ERROS DE LINT

npm run lint -- --fix

## CONFIGURAR PAGE EXTENSIONS

todas as pages tem que termianar em .page.tsx
todas rotas de api tem que terminar em .api.tsx ou .api.ts

## AMBIENTE SERVELESS

Nao Roda WebSocket -> mensageria
Nao Roda long running process filas
escrita de arquivos locais
roda em stateless

## PRISMA

    Podemos fazer a troca de tipo de banco de dados sem trocar nada no código
    so recriar as migrations e a url de conexão
    # CLIENT

npm i @prisma/client

    # ORM

npx prisma init --datasource-provider SQLite

## MIGRATIONS

    npx prisma migrate dev

## VISUALIZAÇÃO DO BANCO DE DADOS

npx prima studio

## NOOKIES

npm i nookies
npm i @types/cookies -D

## NEXTAUTH

melhor utilização para aplicações totalmente frontend
onde o backend e o front sao criados juntos no next
pasta auth com arquivo [...nextauth].api.ts
no app.js => <SessionProvider session={session}> session vem de dentro do pageProps desestruturado
SECRET DO GOOGLE PEGA NO CONSOLE DO GOOGLE
PARA SECRET DO NEXT openssl rand -base64 32

## CONFIGURAR NO GOOGLE CONSOLE

A URL DE CALL BACK
endereço da aplicacao/api/auth/callback/provider
http://localhost:3000/api/auth/callback/google

## NextAuth usando Cookies

Necessita mandar para nosso novo adapter os cookies
como para acessar os cookies temos que acessar usando o req e res
sendo req para acessar o cookie e o
res para fazer a mutabilidade do mesmo

a api do google nao retorna um avatar_url
então podemos definir a propriedade profile e acessar e retornar os dados como preferir
ali dentro ainda temos mais opções a serem exploras.

