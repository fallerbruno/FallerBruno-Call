// sobre escrever a tipagem do next-auth
// não estamos substituindo o next-auth, estamos apenas adicionando novas propriedades
// estamos estendendo a mesma.
import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string

    created_at: Date
    updated_at: Date
  }

  interface Session {
    user: User
  }
}
