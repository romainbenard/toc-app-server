type ApiError = {
  success: false
  message: string
  error?: unknown
}

type ApiSuccess<T = any> = {
  success: true
  message?: string
  data?: T
}

type ApiResponse<T = any> = ApiSuccess<T> | ApiError
