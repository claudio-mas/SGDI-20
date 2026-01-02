import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

export async function auditoriaRoutes(app: FastifyInstance) {
  app.get('/logs', { preHandler: [app.authenticate] }, async (request) => {
    const querySchema = z.object({
      dataInicio: z.string().optional(),
      dataFim: z.string().optional(),
      usuarioId: z.coerce.number().optional(),
      acao: z.string().optional(),
      pagina: z.coerce.number().default(1),
      porPagina: z.coerce.number().default(50),
    });
    const { dataInicio, dataFim, usuarioId, acao, pagina, porPagina } = querySchema.parse(request.query);

    const where = {
      ...(dataInicio && { dataHora: { gte: new Date(dataInicio) } }),
      ...(dataFim && { dataHora: { lte: new Date(dataFim) } }),
      ...(usuarioId && { usuarioId }),
      ...(acao && { acao }),
    };

    const [logs, total] = await Promise.all([
      prisma.logAuditoria.findMany({
        where,
        include: { usuario: { select: { nome: true, email: true } } },
        orderBy: { dataHora: 'desc' },
        skip: (pagina - 1) * porPagina,
        take: porPagina,
      }),
      prisma.logAuditoria.count({ where }),
    ]);

    return { logs, total, paginas: Math.ceil(total / porPagina) };
  });

  app.get('/logs/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const log = await prisma.logAuditoria.findUnique({
      where: { id },
      include: { usuario: true },
    });
    if (!log) return reply.status(404).send({ error: 'Log não encontrado' });
    return log;
  });
}
