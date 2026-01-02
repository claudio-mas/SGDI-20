import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8000),
  
  // Database
  DATABASE_URL: z.string(),
  
  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  // MinIO
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_BUCKET: z.string().default('sgdi-documentos'),
  MINIO_USE_SSL: z.coerce.boolean().default(false),
  
  // Keycloak
  KEYCLOAK_URL: z.string(),
  KEYCLOAK_REALM: z.string().default('sgdi'),
  KEYCLOAK_CLIENT_ID: z.string().default('sgdi-backend'),
  KEYCLOAK_CLIENT_SECRET: z.string(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  
  // CORS
  CORS_ORIGIN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
