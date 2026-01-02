import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

export async function tagsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [app.authenticate] }, async () => {
    return prisma.tag.findMany({
      include: { _count: { select: { documentos: true } } },
      orderBy: { nome: 'asc' },
    });
  });

  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const bodySchema = z.object({
      nome: z.string().min(1).max(50),
      cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      descricao: z.string().optional(),
    });
    const data = bodySchema.parse(request.body);
    const tag = await prisma.tag.create({ data });
    return reply.status(201).send(tag);
  });

  app.put('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const bodySchema = z.object({
      nome: z.string().optional(),
      cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      descricao: z.string().optional(),
    });
    const data = bodySchema.parse(request.body);
    const tag = await prisma.tag.update({ where: { id }, data });
    return tag;
  });

  app.delete('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    await prisma.tag.delete({ where: { id } });
    return reply.status(204).send();
  });
}
