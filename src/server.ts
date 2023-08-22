import app from './app'
import config from './config'
import { logger } from './lib/logger'

const { port } = config

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`)
})
