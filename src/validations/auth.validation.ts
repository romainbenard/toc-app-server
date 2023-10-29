import { z } from 'zod'

export const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
  'g'
)

export const signUpValidation = z.discriminatedUnion('loginType', [
  z.object({
    loginType: z.literal('credentials'),
    loginProvider: z.literal('credentials').optional(),
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().regex(passwordRegex),
  }),
  z.object({
    loginType: z.literal('oauth'),
    loginProvider: z.string().optional(),
    email: z.string().email(),
    providerId: z.string(),
    name: z.string().min(1),
  }),
])

export const logInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type SignUpBody = z.infer<typeof signUpValidation>
export type LogInBody = z.infer<typeof logInValidation>
