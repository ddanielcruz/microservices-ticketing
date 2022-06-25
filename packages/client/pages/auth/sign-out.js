import { useEffect } from 'react'
import { useRouter } from 'next/router'

import useRequest from '../../hooks/use-request'

export default function SignOut() {
  const router = useRouter()
  const { doRequest } = useRequest({
    url: '/api/users/sign-out',
    method: 'POST',
    onSuccess: () => router.push('/')
  })

  useEffect(() => {
    doRequest()
  }, [doRequest])

  return <div>Signing you out...</div>
}
