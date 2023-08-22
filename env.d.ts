declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NODE_ENV: 'production' | 'staging' | 'test' | 'development'
    readonly PORT: string
    readonly DATABASE_URL: string
    readonly SECRET_KEY: string
  }
}
