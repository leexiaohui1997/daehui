import { ApiError } from '../errors/ApiError'

export function getErrorMsg(error: unknown): string {
  if (error instanceof Error) {
    if (error instanceof ApiError) {
      return `${error.message} [${error.code}]`
    }

    return error.message
  }

  return `${error}`
}
