import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

export async function tarefasRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request.user as any).id;
    return prisma.tarefaWorkflow.findMany({
      where: { responsavelId: userId },
      include: {
        workflowInstancia: { include: { documento: true, workflow: true } },
        workflowEtapa: true,
      },
      orderBy: { dataCriacao: 'desc' },
    });
  });

  app.get('/pendentes', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request.user as any).id;
    return prisma.tarefaWorkflow.findMany({
      where: { responsavelId: userId, status: 'pendente' },
      include: { workflowInstancia: { include: { documento: true } } },
    });
  });

  app.post('/:id/aprovar', { preHandler: [app.authenticate] }, async (request) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const { comentario } = z.object({ comentario: z.string().optional() }).parse(request.body);
    return prisma.tarefaWorkflow.update({
      where: { id },
      data: { status: 'aprovado', comentario, dataConclusao: new Date() },
    });
  });

  app.post('/:id/rejeitar', { preHandler: [app.authenticate] }, async (request) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const { comentario } = z.object({ comentario: z.string().min(10) }).parse(request.body);
    return prisma.tarefaWorkflow.update({
      where: { id },
      data: { status: 'rejeitado', comentario, dataConclusao: new Date() },
    });
  });
}
