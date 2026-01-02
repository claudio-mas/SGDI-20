import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

export async function configuracoesRoutes(app: FastifyInstance) {
  // Configurações de compartilhamento
  app.get('/compartilhamento', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request.user as any).id;
    let config = await prisma.configuracaoCompartilhamento.findUnique({ where: { usuarioId: userId } });
    if (!config) {
      config = await prisma.configuracaoCompartilhamento.create({ data: { usuarioId: userId } });
    }
    return config;
  });

  app.put('/compartilhamento', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request.user as any).id;
    const bodySchema = z.object({
      expiracaoPadraoLinks: z.number().optional(),
      permissaoPadrao: z.enum(['leitura', 'comentar', 'edicao']).optional(),
      restringirDownload: z.boolean().optional(),
      permitirLinksPublicos: z.boolean().optional(),
    });
    const data = bodySchema.parse(request.body);
    return prisma.configuracaoCompartilhamento.upsert({
      where: { usuarioId: userId },
      update: data,
      create: { usuarioId: userId, ...data },
    });
  });

  // Configurações de marca d'água
  app.get('/marca-agua', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request.user as any).id;
    let config = await prisma.configuracaoMarcaAgua.findUnique({ where: { usuarioId: userId } });
    if (!config) {
      config = await prisma.configuracaoMarcaAgua.create({ data: { usuarioId: userId } });
    }
    return config;
  });

  app.put('/marca-agua', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request.user as any).id;
    const bodySchema = z.object({
      ativo: z.boolean().optional(),
      conteudo: z.string().optional(),
      posicao: z.string().optional(),
      cor: z.string().optional(),
      tamanho: z.number().optional(),
      opacidade: z.number().min(0).max(100).optional(),
    });
    const data = bodySchema.parse(request.body);
    return prisma.configuracaoMarcaAgua.upsert({
      where: { usuarioId: userId },
      update: data,
      create: { usuarioId: userId, ...data },
    });
  });
}
