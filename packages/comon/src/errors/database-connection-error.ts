import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
  constructor() {
    super('Error connecting to database.', 503)
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}
