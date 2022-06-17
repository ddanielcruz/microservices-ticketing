import { CustomError } from './custom-error'

export class NotFoundError extends CustomError {
  constructor() {
    super('Resource not found.', 404)
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }]
  }
}
