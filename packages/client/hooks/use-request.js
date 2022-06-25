import { useState } from 'react'
import axios from 'axios'

export default ({ url, method, body = {}, onSuccess }) => {
  const [errors, setErrors] = useState([])
  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios.request({ method, url, data: body })

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (error) {
      const { data } = error.response
      setErrors(
        <div className="alert alert-danger">
          <h4>Ops...</h4>
          <ul className="my-0">
            {data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}
