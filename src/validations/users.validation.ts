import { z } from 'zod'
import { passwordRegex } from './auth.validation'

export const updateUserValidation = z
  .object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().regex(passwordRegex),
  })
  .partial()

export type UserUpdateBody = z.infer<typeof updateUserValidation>
