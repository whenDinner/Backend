export default () => ({
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT) || 8000,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_SCHEMA: process.env.DATABASE_SCHEMA,
  TYPEORM_SYBCHRONIZE: process.env.MODE === "DEV" ? true : false,
  MODE: process.env.MODE,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 8080,
  REDIS_TTL: parseInt(process.env.REDIS_TTL) || 100000,
  GBSW_CLIENT_ID: process.env.GBSW_CLIENT_ID,
  GBSW_REDIRECT_URI: process.env.GBSW_REDIRECT_URI,
  GBSW_SCOPES: process.env.GBSW_SCOPES,
  GBSW_PUBKEY_URL: process.env.GBSW_PUBKEY_URL,
  GBSW_ISSUER: process.env.GBSW_ISSUER
})
