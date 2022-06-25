import axios from 'axios'

export default ({ req = {} } = {}) => {
  let baseURL = ''
  if (typeof window === 'undefined') {
    baseURL = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
  }

  return axios.create({
    baseURL,
    headers: req.headers || {}
  })
}
