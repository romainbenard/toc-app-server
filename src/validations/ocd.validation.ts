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

export const queryOcdsValidation = z.object({
  category: categoryValidation.optional(),
  location: locationValidation.optional(),
  date: z.string().optional(),
  authorId: z.string().optional(),
})

export type QueryOcds = z.infer<typeof queryOcdsValidation>

export const createOcdValidation = z.object({
  name: z.string().min(2).max(100),
  category: categoryValidation,
  description: z.string().max(200).optional(),
  intensity: z.coerce.number().min(0).max(5),
  repetition: z.union([z.coerce.number().min(0).max(200), z.nan()]).optional(),
  timeLost: z.union([z.coerce.number().min(0), z.nan()]).optional(),
  location: locationValidation,
  date: z.string(),
})

export type CreateOcdBody = z.infer<typeof createOcdValidation>

export const updateOcdValidation = createOcdValidation.partial()
