import '../lib/dayjs'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'
import { globalStyles } from '@/styles/global'
import 'react-toastify/dist/ReactToastify.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'

globalStyles()
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
