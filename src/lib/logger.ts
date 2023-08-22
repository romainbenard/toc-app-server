import pino from 'pino-http'
import config from '../config'

const devOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
}

const envOptions = {
  production: {},
  development: devOptions,
  test: {},
  staging: {},
}

const httpLogger = pino({
  enabled: config.env !== 'test',
  ...envOptions[config.env],
})

export const logger = httpLogger.logger

export default httpLogger
