import { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';
import { redis } from '../config/redis';

interface Colaborador {
  id: number;
  nome: string;
  cor: string;
  cursor?: { x: number; y: number; pagina: number };
}

// Mapa de conexões por documento
const documentoConexoes = new Map<number, Map<number, WebSocket>>();
const colaboradores = new Map<number, Map<number, Colaborador>>();

// Cores para colaboradores
const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

export async function wsRoutes(app: FastifyInstance) {
  // WebSocket para colaboração em tempo real
  app.get('/documento/:id', { websocket: true }, async (connection, request) => {
    const documentoId = parseInt((request.params as any).id);
    const token = (request.query as any).token;

    // Validar token
    let usuario: any;
    try {
      usuario = app.jwt.verify(token);
    } catch {
      connection.socket.close(4001, 'Token inválido');
      return;
    }

    const userId = usuario.id;
    const ws = connection.socket;

    // Inicializar estruturas se necessário
    if (!documentoConexoes.has(documentoId)) {
      documentoConexoes.set(documentoId, new Map());
      colaboradores.set(documentoId, new Map());
    }

    const conexoes = documentoConexoes.get(documentoId)!;
    const colabs = colaboradores.get(documentoId)!;

    // Adicionar colaborador
    const corIndex = colabs.size % cores.length;
    const colaborador: Colaborador = {
      id: userId,
      nome: usuario.nome || `Usuário ${userId}`,
      cor: cores[corIndex],
    };
    
    conexoes.set(userId, ws);
    colabs.set(userId, colaborador);

    // Notificar entrada
    broadcast(documentoId, {
      tipo: 'usuario_entrou',
      usuario: colaborador,
      colaboradores: Array.from(colabs.values()),
    }, userId);

    // Enviar estado inicial
    ws.send(JSON.stringify({
      tipo: 'estado_inicial',
      colaboradores: Array.from(colabs.values()),
      meuId: userId,
    }));

    // Publicar no Redis para escalar horizontalmente
    await redis.publish(`doc:${documentoId}:presenca`, JSON.stringify({
      acao: 'entrou',
      usuario: colaborador,
    }));

    // Handler de mensagens
    ws.on('message', async (data) => {
      try {
        const mensagem = JSON.parse(data.toString());

        switch (mensagem.tipo) {
          case 'cursor_move':
            // Atualizar posição do cursor
            if (colabs.has(userId)) {
              colabs.get(userId)!.cursor = mensagem.cursor;
            }
            broadcast(documentoId, {
              tipo: 'cursor_atualizado',
              usuarioId: userId,
              cursor: mensagem.cursor,
            }, userId);
            break;

          case 'edicao':
            // Propagar edição para outros colaboradores
            broadcast(documentoId, {
              tipo: 'edicao',
              usuarioId: userId,
              operacao: mensagem.operacao,
            }, userId);
            break;

          case 'chat':
            // Mensagem de chat
            const chatMsg = {
              tipo: 'chat',
              usuarioId: userId,
              nome: colaborador.nome,
              mensagem: mensagem.texto,
              timestamp: new Date().toISOString(),
            };
            broadcast(documentoId, chatMsg);
            
            // Persistir no Redis para histórico
            await redis.lpush(`doc:${documentoId}:chat`, JSON.stringify(chatMsg));
            await redis.ltrim(`doc:${documentoId}:chat`, 0, 99); // Manter últimas 100
            break;

          case 'ping':
            ws.send(JSON.stringify({ tipo: 'pong' }));
            break;
        }
      } catch (err) {
        console.error('Erro ao processar mensagem WebSocket:', err);
      }
    });

    // Handler de desconexão
    ws.on('close', async () => {
      conexoes.delete(userId);
      colabs.delete(userId);

      // Notificar saída
      broadcast(documentoId, {
        tipo: 'usuario_saiu',
        usuarioId: userId,
        colaboradores: Array.from(colabs.values()),
      });

      // Limpar estruturas se vazio
      if (conexoes.size === 0) {
        documentoConexoes.delete(documentoId);
        colaboradores.delete(documentoId);
      }

      await redis.publish(`doc:${documentoId}:presenca`, JSON.stringify({
        acao: 'saiu',
        usuarioId: userId,
      }));
    });

    ws.on('error', (err) => {
      console.error('Erro WebSocket:', err);
    });
  });

  // Endpoint para obter histórico de chat
  app.get('/documento/:id/chat', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const documentoId = parseInt((request.params as any).id);
    const mensagens = await redis.lrange(`doc:${documentoId}:chat`, 0, 99);
    return mensagens.map(m => JSON.parse(m)).reverse();
  });
}

// Broadcast para todos os colaboradores de um documento
function broadcast(documentoId: number, mensagem: any, excluirUserId?: number) {
  const conexoes = documentoConexoes.get(documentoId);
  if (!conexoes) return;

  const payload = JSON.stringify(mensagem);
  
  conexoes.forEach((ws, odId) => {
    if (excluirUserId && odId === excluirUserId) return;
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}
