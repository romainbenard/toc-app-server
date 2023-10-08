import { z } from 'zod'

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
  'g'
)

export const createUserValidation = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().regex(passwordRegex),
})

export const updateUserValidation = createUserValidation.partial()

export const loginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type userCreateBody = z.infer<typeof createUserValidation>
export type userUpdateBody = z.infer<typeof updateUserValidation>
export type userLoginBody = z.infer<typeof loginValidation>
