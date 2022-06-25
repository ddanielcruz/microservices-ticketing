export abstract class CustomError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): { message: string; field?: string }[]
}
