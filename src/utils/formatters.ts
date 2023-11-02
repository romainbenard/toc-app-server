import { User } from '@prisma/client'

export const formatUserForClient = (user: User) => ({
  id: user.id,
  loginProvider: user.loginProvider,
  email: user.email,
  name: user.name,
})
