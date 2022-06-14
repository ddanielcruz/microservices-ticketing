import express from 'express'

const app = express()
app.use(express.json())

const { PORT = '3000' } = process.env

app.get('/api/users/currentUser', (_request, response) => {
  return response.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`)
})
