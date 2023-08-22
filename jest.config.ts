import dotenv from 'dotenv'
import type { Config } from 'jest'

dotenv.config({ path: '.env.test' })

export default async (): Promise<Config> => {
  return {
    globals: {
      'ts-jest': {
        isolatedModules: true,
      },
    },
    verbose: true,
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
  }
}
