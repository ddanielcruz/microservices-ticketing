import { useState } from 'react'
import { useRouter } from 'next/router'

import useRequest from '../../hooks/use-request'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/sign-in',
    method: 'POST',
    body: { email, password },
    onSuccess: () => router.push('/')
  })

  const handleSubmit = async e => {
    e.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      {errors}

      <button className="btn btn-primary">Sign In</button>
    </form>
  )
}
