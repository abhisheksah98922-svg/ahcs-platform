import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://ahcs.in'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .default('postgresql://ahcs_user:ahcs_password@localhost:5432/ahcs_db?schema=public'),
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET must be at least 32 characters')
    .default('development-session-secret-change-in-production-min32chars'),
  PEPPER_SECRET: z
    .string()
    .min(16, 'PEPPER_SECRET must be at least 16 characters')
    .default('development-pepper-secret-minimum16'),
  REDIS_URL: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default('ap-south-1'),
  S3_BUCKET: z.string().default('ahcs-documents-vault'),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  SMS_GATEWAY_API_KEY: z.string().optional(),
}).refine(
  (data) => {
    if (data.NODE_ENV === 'production') {
      return (
        !data.SESSION_SECRET.includes('development') &&
        !data.PEPPER_SECRET.includes('development')
      );
    }
    return true;
  },
  {
    message: 'Production secrets must not use default development placeholder values',
    path: ['SESSION_SECRET'],
  }
);

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

export function getEnv(overrideEnv?: Record<string, string | undefined>): Env {
  if (!overrideEnv && parsedEnv) return parsedEnv;

  const source = overrideEnv ?? process.env;
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const errorDetails = JSON.stringify(result.error.format(), null, 2);
    console.error('❌ Invalid environment variables:', errorDetails);
    throw new Error(`Invalid environment configuration: ${errorDetails}`);
  }

  if (!overrideEnv) {
    parsedEnv = result.data;
  }
  return result.data;
}

export const env = getEnv();
