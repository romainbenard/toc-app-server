import { z } from 'zod'

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
  'g'
)

export const createUserValidation = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().regex(passwordRegex),
})

export const updateUserValidation = createUserValidation.partial()

export const loginValidation = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type CreateUser = z.infer<typeof createUserValidation>
export type UpdateUser = z.infer<typeof updateUserValidation>
export type LoginUser = z.infer<typeof loginValidation>
