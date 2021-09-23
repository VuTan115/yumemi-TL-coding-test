import type { AppProps } from 'next/app'
import DefaultLayout from '../layouts/Default'
import '../assets/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DefaultLayout>
      <Component {...pageProps} />
    </DefaultLayout>
  )
}
export default MyApp
