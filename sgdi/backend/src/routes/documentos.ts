import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { prisma } from '../config/database';
import { uploadFile, getDownloadUrl, deleteFile } from '../config/minio';

export async function documentosRoutes(app: FastifyInstance) {
  // Listar documentos do usuário
  app.get('/', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const querySchema = z.object({
      pastaId: z.coerce.number().optional(),
      status: z.string().optional(),
      busca: z.string().optional(),
      pagina: z.coerce.number().default(1),
      porPagina: z.coerce.number().default(20),
    });

    const { pastaId, status, busca, pagina, porPagina } = querySchema.parse(request.query);
    const userId = (request.user as any).id;

    const where = {
      proprietarioId: userId,
      excluidoEm: null,
      ...(pastaId && { pastaId }),
      ...(status && { status }),
      ...(busca && { nome: { contains: busca, mode: 'insensitive' as const } }),
    };

    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        where,
        include: {
          tags: { include: { tag: true } },
          pasta: true,
        },
        orderBy: { dataModificacao: 'desc' },
        skip: (pagina - 1) * porPagina,
        take: porPagina,
      }),
      prisma.documento.count({ where }),
    ]);

    return {
      documentos,
      paginacao: {
        pagina,
        porPagina,
        total,
        totalPaginas: Math.ceil(total / porPagina),
      },
    };
  });

  // Obter documento por ID
  app.get('/:id', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const userId = (request.user as any).id;

    const documento = await prisma.documento.findFirst({
      where: {
        id,
        OR: [
          { proprietarioId: userId },
          { compartilhamentos: { some: { usuarioId: userId } } },
        ],
      },
      include: {
        tags: { include: { tag: true } },
        pasta: true,
        proprietario: { select: { id: true, nome: true, email: true } },
        versoes: { orderBy: { numeroVersao: 'desc' }, take: 5 },
      },
    });

    if (!documento) {
      return reply.status(404).send({ error: 'Documento não encontrado' });
    }

    return documento;
  });

  // Upload de documento
  app.post('/upload', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: 'Nenhum arquivo enviado' });
    }

    const userId = (request.user as any).id;
    const buffer = await data.toBuffer();
    const fileExtension = data.filename.split('.').pop() || '';
    const objectName = `${userId}/${randomUUID()}.${fileExtension}`;

    // Upload para MinIO
    await uploadFile(objectName, buffer, data.mimetype);

    // Criar registro no banco
    const documento = await prisma.documento.create({
      data: {
        nome: data.filename,
        tipo: fileExtension,
        tamanho: buffer.length,
        caminhoStorage: objectName,
        proprietarioId: userId,
        status: 'rascunho',
      },
    });

    // Criar primeira versão
    await prisma.versao.create({
      data: {
        documentoId: documento.id,
        numeroVersao: 1,
        autorId: userId,
        caminhoStorage: objectName,
        comentario: 'Versão inicial',
      },
    });

    // Registrar atividade
    await prisma.atividade.create({
      data: {
        usuarioId: userId,
        tipoAcao: 'UPLOAD',
        entidade: 'documento',
        entidadeId: documento.id,
        descricao: `Upload do documento "${data.filename}"`,
      },
    });

    return reply.status(201).send(documento);
  });

  // Atualizar documento
  app.put('/:id', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const bodySchema = z.object({
      nome: z.string().optional(),
      descricao: z.string().optional(),
      pastaId: z.number().nullable().optional(),
      tags: z.array(z.number()).optional(),
    });

    const body = bodySchema.parse(request.body);
    const userId = (request.user as any).id;

    const documento = await prisma.documento.findFirst({
      where: { id, proprietarioId: userId },
    });

    if (!documento) {
      return reply.status(404).send({ error: 'Documento não encontrado' });
    }

    // Atualizar documento
    const atualizado = await prisma.documento.update({
      where: { id },
      data: {
        nome: body.nome,
        pastaId: body.pastaId,
      },
    });

    // Atualizar tags se fornecidas
    if (body.tags) {
      await prisma.documentoTag.deleteMany({ where: { documentoId: id } });
      await prisma.documentoTag.createMany({
        data: body.tags.map(tagId => ({ documentoId: id, tagId })),
      });
    }

    return atualizado;
  });

  // Excluir documento (soft delete)
  app.delete('/:id', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const userId = (request.user as any).id;

    const documento = await prisma.documento.findFirst({
      where: { id, proprietarioId: userId },
    });

    if (!documento) {
      return reply.status(404).send({ error: 'Documento não encontrado' });
    }

    await prisma.documento.update({
      where: { id },
      data: { excluidoEm: new Date() },
    });

    return reply.status(204).send();
  });

  // Gerar URL de download
  app.post('/:id/download', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const userId = (request.user as any).id;

    const documento = await prisma.documento.findFirst({
      where: {
        id,
        OR: [
          { proprietarioId: userId },
          { compartilhamentos: { some: { usuarioId: userId } } },
        ],
      },
    });

    if (!documento) {
      return reply.status(404).send({ error: 'Documento não encontrado' });
    }

    const downloadUrl = await getDownloadUrl(documento.caminhoStorage, 3600);

    return { downloadUrl, expiraEm: new Date(Date.now() + 3600 * 1000) };
  });

  // Submeter para aprovação
  app.post('/:id/submeter-aprovacao', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(request.params);
    const bodySchema = z.object({
      comentario: z.string().optional(),
      urgente: z.boolean().default(false),
    });

    const body = bodySchema.parse(request.body);
    const userId = (request.user as any).id;

    const documento = await prisma.documento.findFirst({
      where: { id, proprietarioId: userId },
    });

    if (!documento) {
      return reply.status(404).send({ error: 'Documento não encontrado' });
    }

    // Atualizar status
    await prisma.documento.update({
      where: { id },
      data: { status: 'em_revisao' },
    });

    // Criar solicitação de aprovação
    const aprovacao = await prisma.aprovacao.create({
      data: {
        documentoId: id,
        solicitanteId: userId,
        comentario: body.comentario,
      },
    });

    return aprovacao;
  });
}
