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
    modulePathIgnorePatterns: ['/node_modules/', '/dist/'],
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
  }
}
