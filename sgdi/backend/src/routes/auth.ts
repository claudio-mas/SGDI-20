import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/database';

export async function authRoutes(app: FastifyInstance) {
  // Callback do Keycloak após login
  app.post('/callback', async (request, reply) => {
    const bodySchema = z.object({
      keycloakId: z.string(),
      email: z.string().email(),
      nome: z.string(),
    });

    const { keycloakId, email, nome } = bodySchema.parse(request.body);

    // Buscar ou criar usuário
    let usuario = await prisma.usuario.findUnique({
      where: { keycloakId },
      include: { perfil: true, setor: true },
    });

    if (!usuario) {
      // Primeiro usuário é Administrador, demais são Usuário Padrão
      const totalUsuarios = await prisma.usuario.count();
      const perfilPadrao = await prisma.perfil.findFirst({
        where: { nome: totalUsuarios === 0 ? 'Administrador' : 'Usuário Padrão' },
      });

      usuario = await prisma.usuario.create({
        data: {
          keycloakId,
          email,
          nome,
          perfilId: perfilPadrao!.id,
        },
        include: { perfil: true, setor: true },
      });
    }

    // Atualizar último acesso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcesso: new Date() },
    });

    // Gerar JWT interno
    const token = app.jwt.sign({
      id: usuario.id,
      email: usuario.email,
      perfilId: usuario.perfilId,
      setorId: usuario.setorId,
    });

    return reply.send({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil.nome,
        setor: usuario.setor?.nome,
      },
    });
  });

  // Verificar token
  app.get('/me', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const usuario = await prisma.usuario.findUnique({
      where: { id: (request.user as any).id },
      include: { 
        perfil: { include: { permissoes: { include: { permissao: true } } } },
        setor: true,
      },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cargo: usuario.cargo,
      fotoPerfil: usuario.fotoPerfil,
      perfil: usuario.perfil.nome,
      setor: usuario.setor?.nome,
      permissoes: usuario.perfil.permissoes.map(p => p.permissao.codigo),
    };
  });

  // Logout
  app.post('/logout', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    // Invalidar sessão no Redis se necessário
    return reply.send({ message: 'Logout realizado com sucesso' });
  });
}
