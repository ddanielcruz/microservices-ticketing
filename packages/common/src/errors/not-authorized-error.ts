import { CustomError } from './custom-error'

export class NotAuthorizedError extends CustomError {
  constructor() {
    super('Not authorized.', 401)
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }]
  }
}
