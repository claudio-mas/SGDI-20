import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

export async function usuariosRoutes(app: FastifyInstance) {
  // Listar usuários (admin)
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const usuarios = await prisma.usuario.findMany({
      include: { perfil: true, setor: true },
      orderBy: { nome: 'asc' },
    });
    return usuarios;
  });

  // Obter usuário por ID
  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { perfil: true, setor: true },
    });
    if (!usuario) return reply.status(404).send({ error: 'Usuário não encontrado' });
    return usuario;
  });

  // Atualizar perfil próprio
  app.put('/perfil', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request.user as any).id;
    const bodySchema = z.object({
      nome: z.string().optional(),
      telefone: z.string().optional(),
      cargo: z.string().optional(),
    });
    const data = bodySchema.parse(request.body);
    return prisma.usuario.update({ where: { id: userId }, data });
  });
}
