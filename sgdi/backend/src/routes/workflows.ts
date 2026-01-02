import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

export async function workflowsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [app.authenticate] }, async () => {
    return prisma.workflow.findMany({
      include: { etapas: true, criadoPor: { select: { nome: true } } },
      orderBy: { dataModificacao: 'desc' },
    });
  });

  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: { etapas: true, instancias: { take: 10 } },
    });
    if (!workflow) return reply.status(404).send({ error: 'Workflow não encontrado' });
    return workflow;
  });

  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const userId = (request.user as any).id;
    const bodySchema = z.object({
      nome: z.string().min(1),
      descricao: z.string().optional(),
      setorId: z.number().optional(),
    });
    const data = bodySchema.parse(request.body);
    const workflow = await prisma.workflow.create({
      data: { ...data, criadoPorId: userId },
    });
    return reply.status(201).send(workflow);
  });

  app.put('/:id', { preHandler: [app.authenticate] }, async (request) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const bodySchema = z.object({
      nome: z.string().optional(),
      descricao: z.string().optional(),
      configuracaoJson: z.any().optional(),
    });
    const data = bodySchema.parse(request.body);
    return prisma.workflow.update({ where: { id }, data });
  });

  app.post('/:id/ativar', { preHandler: [app.authenticate] }, async (request) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    return prisma.workflow.update({ where: { id }, data: { status: 'ativo' } });
  });

  app.post('/:id/desativar', { preHandler: [app.authenticate] }, async (request) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    return prisma.workflow.update({ where: { id }, data: { status: 'inativo' } });
  });
}
