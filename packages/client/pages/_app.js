import 'bootstrap/dist/css/bootstrap.min.css'

import buildClient from '../api/build-client'
import Header from '../components/header'

export default function MyApp({ Component, pageProps, currentUser }) {
  return (
    <main>
      <Header currentUser={currentUser} />
      <div className="container py-3">
        <Component {...pageProps} />
      </div>
    </main>
  )
}

MyApp.getInitialProps = async ({ ctx, Component }) => {
  let pageProps = {}
  const { data } = await buildClient(ctx).get('/api/users/current-user')

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return { pageProps, ...data }
}
