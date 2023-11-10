import { User } from '@prisma/client'

type UserClient = Omit<
  User,
  'password' | 'createdAt' | 'updatedAt' | 'providerId' | 'loginType'
>
