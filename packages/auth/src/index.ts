import express from 'express'
import 'express-async-errors'

import { errorHandler } from './middleware/error-handler'
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/sign-in'
import { signOutRouter } from './routes/sign-out'
import { signUpRouter } from './routes/sign-up'

const app = express()
app.use(express.json())
app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)
app.use(errorHandler)

const { PORT = '3000' } = process.env
app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`)
})
