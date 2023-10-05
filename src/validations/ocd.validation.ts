import { z } from 'zod'

const categoryValidation = z.enum([
  'CHECKING',
  'ORGANISATION',
  'CONTAMINATION',
  'INTRUSIVE_THOUGHT',
])

const locationValidation = z.enum([
  'HOME',
  'WORK',
  'PUBLIC_TRANSPORT',
  'OUTDOOR',
])

export const createOcdValidation = z.object({
  category: categoryValidation,
  description: z.string().optional(),
  intensity: z.number().min(0).max(5),
  repetition: z.number().min(0).max(200).optional(),
  timeLost: z.number().min(0).optional(),
  location: locationValidation,
  date: z.string().datetime(),
  authorId: z.string(),
})

export const updateOcdValidation = createOcdValidation.partial()
