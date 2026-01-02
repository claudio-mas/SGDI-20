-- Criar schemas separados para Keycloak (se necessário)
-- CREATE SCHEMA IF NOT EXISTS keycloak;

-- Inserir perfis padrão
INSERT INTO perfis (nome, descricao, nivel_tecnico, ativo) VALUES
  ('Administrador', 'Acesso total ao sistema', 'Alto', true),
  ('Gestor', 'Gerencia documentos do setor', 'Médio', true),
  ('Usuário Padrão', 'Usuário comum do sistema', 'Básico', true),
  ('Auditor', 'Acesso somente leitura para auditoria', 'Médio', true),
  ('Visitante', 'Acesso a documentos públicos', 'Básico', true)
ON CONFLICT (nome) DO NOTHING;

-- Inserir permissões
INSERT INTO permissoes (codigo, nome, descricao, modulo, ativo) VALUES
  ('USUARIO_CRIAR', 'Criar Usuário', 'Permite criar novos usuários', 'usuarios', true),
  ('USUARIO_EDITAR', 'Editar Usuário', 'Permite editar usuários', 'usuarios', true),
  ('USUARIO_EXCLUIR', 'Excluir Usuário', 'Permite excluir usuários', 'usuarios', true),
  ('USUARIO_LISTAR', 'Listar Usuários', 'Permite listar usuários', 'usuarios', true),
  ('DOCUMENTO_UPLOAD', 'Upload de Documento', 'Permite fazer upload', 'documentos', true),
  ('DOCUMENTO_EDITAR', 'Editar Documento', 'Permite editar documentos', 'documentos', true),
  ('DOCUMENTO_EXCLUIR', 'Excluir Documento', 'Permite excluir documentos', 'documentos', true),
  ('DOCUMENTO_VISUALIZAR', 'Visualizar Documento', 'Permite visualizar documentos', 'documentos', true),
  ('DOCUMENTO_COMPARTILHAR', 'Compartilhar Documento', 'Permite compartilhar', 'documentos', true),
  ('DOCUMENTO_APROVAR', 'Aprovar Documento', 'Permite aprovar documentos', 'documentos', true),
  ('LOG_VISUALIZAR', 'Visualizar Logs', 'Permite ver logs de auditoria', 'auditoria', true),
  ('LOG_EXPORTAR', 'Exportar Logs', 'Permite exportar logs', 'auditoria', true),
  ('CONFIG_SISTEMA', 'Configurar Sistema', 'Permite alterar configurações', 'sistema', true),
  ('BACKUP_EXECUTAR', 'Executar Backup', 'Permite executar backups', 'sistema', true)
ON CONFLICT (codigo) DO NOTHING;

-- Associar permissões aos perfis (Administrador tem todas)
INSERT INTO perfil_permissoes (perfil_id, permissao_id)
SELECT p.id, perm.id FROM perfis p, permissoes perm WHERE p.nome = 'Administrador'
ON CONFLICT DO NOTHING;

-- Inserir tags padrão
INSERT INTO tags (nome, cor, descricao) VALUES
  ('Urgente', '#EF4444', 'Documentos urgentes'),
  ('Em Revisão', '#F97316', 'Documentos em revisão'),
  ('Aprovado', '#22C55E', 'Documentos aprovados'),
  ('Confidencial', '#6B7280', 'Documentos confidenciais'),
  ('Financeiro', '#3B82F6', 'Documentos financeiros'),
  ('Jurídico', '#DC2626', 'Documentos jurídicos'),
  ('RH', '#10B981', 'Documentos de RH'),
  ('Projetos', '#8B5CF6', 'Documentos de projetos')
ON CONFLICT DO NOTHING;

-- Inserir setores padrão
INSERT INTO setores (nome, descricao, ativo) VALUES
  ('Marketing', 'Departamento de Marketing', true),
  ('Financeiro', 'Departamento Financeiro', true),
  ('Jurídico', 'Departamento Jurídico', true),
  ('RH', 'Recursos Humanos', true),
  ('TI', 'Tecnologia da Informação', true),
  ('Comercial', 'Departamento Comercial', true)
ON CONFLICT (nome) DO NOTHING;
