import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';

import { env } from './config/env';
import { prisma } from './config/database';
import { redis } from './config/redis';
import { minioClient } from './config/minio';

// Rotas
import { authRoutes } from './routes/auth';
import { documentosRoutes } from './routes/documentos';
import { pastasRoutes } from './routes/pastas';
import { usuariosRoutes } from './routes/usuarios';
import { tagsRoutes } from './routes/tags';
import { workflowsRoutes } from './routes/workflows';
import { tarefasRoutes } from './routes/tarefas';
import { auditoriaRoutes } from './routes/auditoria';
import { configuracoesRoutes } from './routes/configuracoes';
import { wsRoutes } from './routes/websocket';

const app = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: env.NODE_ENV === 'development' 
      ? { target: 'pino-pretty' } 
      : undefined,
  },
});

async function bootstrap() {
  // Plugins de segurança
  await app.register(helmet);
  await app.register(cors, {
    origin: env.CORS_ORIGIN || true,
    credentials: true,
  });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // JWT
  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Upload de arquivos
  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // WebSocket
  await app.register(websocket);

  // Health check
  app.get('/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      services: {
        database: await checkDatabase(),
        redis: await checkRedis(),
        minio: await checkMinio(),
      }
    };
  });

  // Registrar rotas
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(documentosRoutes, { prefix: '/api/documentos' });
  await app.register(pastasRoutes, { prefix: '/api/pastas' });
  await app.register(usuariosRoutes, { prefix: '/api/usuarios' });
  await app.register(tagsRoutes, { prefix: '/api/tags' });
  await app.register(workflowsRoutes, { prefix: '/api/workflows' });
  await app.register(tarefasRoutes, { prefix: '/api/tarefas' });
  await app.register(auditoriaRoutes, { prefix: '/api/auditoria' });
  await app.register(configuracoesRoutes, { prefix: '/api/configuracoes' });
  await app.register(wsRoutes, { prefix: '/ws' });

  // Iniciar servidor
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 SGDI Backend rodando em http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

async function checkDatabase(): Promise<string> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'ok';
  } catch {
    return 'error';
  }
}

async function checkRedis(): Promise<string> {
  try {
    await redis.ping();
    return 'ok';
  } catch {
    return 'error';
  }
}

async function checkMinio(): Promise<string> {
  try {
    await minioClient.listBuckets();
    return 'ok';
  } catch {
    return 'error';
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    app.log.info(`Recebido ${signal}, encerrando...`);
    await app.close();
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
  });
});

bootstrap();
