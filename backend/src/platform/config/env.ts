import { z } from 'zod'

const booleanEnv = z.preprocess(
  (value) => value === true || value === 'true',
  z.boolean(),
)
const optionalNonEmpty = z.preprocess(
  (value) => value === '' ? undefined : value,
  z.string().min(1).optional(),
)

const serverEnvSchema = z.object({
  APP_ENV: z.enum(['local', 'test', 'staging', 'production']).default('local'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65_535).default(3000),
  APP_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  AUTH_TOKEN_ENCRYPTION_KEY: z.string().min(32),
  AUTH_RATE_LIMIT_SECRET: z.string().min(32),
  AUTH_RATE_LIMIT_DRIVER: z.enum(['disabled', 'memory', 'redis']).default('memory'),
  REDIS_URL: z.string().url().optional(),
  SMTP_HOST: z.string().min(1).default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().max(65_535).default(1025),
  SMTP_SECURE: booleanEnv.default(false),
  SMTP_FROM: z.string().email().default('no-reply@gmm-wedding.local'),
  SMTP_USER: optionalNonEmpty,
  SMTP_PASSWORD: optionalNonEmpty,
  TRUST_PROXY: booleanEnv.default(false),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  API_DOCS_ENABLED: booleanEnv.default(false),
}).superRefine((env, context) => {
  if (env.AUTH_RATE_LIMIT_DRIVER === 'redis' && !env.REDIS_URL) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['REDIS_URL'],
      message: 'REDIS_URL is required when AUTH_RATE_LIMIT_DRIVER=redis',
    })
  }
  if (env.APP_ENV === 'production' && env.AUTH_RATE_LIMIT_DRIVER !== 'redis') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['AUTH_RATE_LIMIT_DRIVER'],
      message: 'Production authentication requires the distributed Redis rate limiter',
    })
  }
  if (!['local', 'test'].includes(env.APP_ENV) && env.AUTH_RATE_LIMIT_DRIVER === 'disabled') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['AUTH_RATE_LIMIT_DRIVER'],
      message: 'Rate limiting may only be disabled in local or test environments',
    })
  }
  if (Boolean(env.SMTP_USER) !== Boolean(env.SMTP_PASSWORD)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['SMTP_USER'],
      message: 'SMTP_USER and SMTP_PASSWORD must be configured together',
    })
  }
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: ServerEnv | undefined

export function getServerEnv(): ServerEnv {
  cachedEnv ??= serverEnvSchema.parse(process.env)
  return cachedEnv
}
