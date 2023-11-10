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
  intensity: z.coerce.number().min(0).max(5),
  repetition: z.union([z.coerce.number().min(0).max(200), z.nan()]).optional(),
  timeLost: z.union([z.coerce.number().min(0), z.nan()]).optional(),
  location: locationValidation,
  date: z.string(),
})

export const updateOcdValidation = createOcdValidation.partial()

export type CreateOcdBody = z.infer<typeof createOcdValidation>
