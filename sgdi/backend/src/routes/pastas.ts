import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

export async function pastasRoutes(app: FastifyInstance) {
  // Listar pastas do usuário
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request.user as any).id;
    const pastas = await prisma.pasta.findMany({
      where: { proprietarioId: userId },
      include: { subPastas: true, _count: { select: { documentos: true } } },
      orderBy: { nome: 'asc' },
    });
    return pastas;
  });

  // Criar pasta
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const bodySchema = z.object({
      nome: z.string().min(1).max(255),
      pastaPaiId: z.number().nullable().optional(),
    });
    const { nome, pastaPaiId } = bodySchema.parse(request.body);
    const userId = (request.user as any).id;

    const pasta = await prisma.pasta.create({
      data: { nome, pastaPaiId, proprietarioId: userId },
    });
    return reply.status(201).send(pasta);
  });

  // Atualizar pasta
  app.put('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const { nome } = z.object({ nome: z.string().min(1) }).parse(request.body);
    const userId = (request.user as any).id;

    const pasta = await prisma.pasta.updateMany({
      where: { id, proprietarioId: userId },
      data: { nome },
    });
    if (pasta.count === 0) return reply.status(404).send({ error: 'Pasta não encontrada' });
    return { success: true };
  });

  // Excluir pasta
  app.delete('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const userId = (request.user as any).id;

    await prisma.pasta.deleteMany({ where: { id, proprietarioId: userId } });
    return reply.status(204).send();
  });
}
