import dotenv from 'dotenv'

dotenv.config()

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database: {
    url: process.env.DATABASE_URL,
  },
  secretKey: process.env.SECRET_KEY,
}

export default config
