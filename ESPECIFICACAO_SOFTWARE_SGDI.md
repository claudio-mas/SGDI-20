# Especificação de Software - SGDI
## Sistema de Gestão de Documentos Inteligente

**Versão:** 1.0  
**Data:** Janeiro 2026  
**Baseado em:** Análise dos templates de interface do projeto

---

## 1. Visão Geral do Sistema

### 1.1 Descrição
O SGDI (Sistema de Gestão de Documentos Inteligente) é uma plataforma web corporativa para gerenciamento, organização, compartilhamento e colaboração em documentos digitais. O sistema é identificado nos templates como "DocManager", "DocuManager", "DocExplorer" e "DocSecure", indicando diferentes módulos ou variações de branding.

### 1.2 Público-Alvo
- Empresas de médio e grande porte
- Equipes corporativas (Marketing, Financeiro, Jurídico, RH, Design)
- Profissionais que necessitam de gestão documental colaborativa

### 1.3 Características Principais
- Interface moderna e responsiva (Tailwind CSS)
- Suporte a tema claro/escuro (Dark Mode)
- Design system consistente com Material Symbols
- Arquitetura multi-tenant (Enterprise Edition)

---

## 2. Módulos Funcionais

### 2.1 Autenticação e Registro
**Template:** `templates/login/registro/code.html`

**Funcionalidades:**
- Login com e-mail corporativo e senha
- Opção "Esqueceu a senha?"
- Autenticação SSO (Google e Microsoft)
- Criação de nova conta
- Proteção reCAPTCHA
- Certificações de segurança (ISO 27001, dados criptografados)

**Campos de Login:**
- E-mail corporativo
- Senha (com toggle de visibilidade)

### 2.2 Dashboard Principal
**Templates:** `templates/dashboard_principal/`, `templates/dashboard_principal_1/`, `templates/dashboard_principal_2/`

**Funcionalidades:**
- Visão geral personalizada ("Bom dia, [Nome]!")
- Estatísticas em cards:
  - Total de Documentos
  - Documentos Compartilhados
  - Aprovações Pendentes
- Acesso Rápido:
  - Upload de Arquivo
  - Nova Pasta
  - Digitalizar documento
  - Gerenciar Equipe
- Lista de Documentos Recentes (tabela)
- Widget de Armazenamento (uso de espaço)
- Feed de Atividade Recente (timeline)
- Notificações

**Widgets de Workflow (variações):**
- Status de Workflows:
  - Workflows ativos
  - Pendentes de revisão
  - Tempo médio de conclusão
  - Taxa de aprovação
- Minhas Tarefas:
  - Contador de tarefas pendentes
  - Lista resumida de tarefas urgentes
  - Link para "Ver todas as tarefas"

**Navegação Lateral:**
- Dashboard
- Meus Arquivos
- Compartilhados
- Recentes
- Minhas Tarefas (com badge de pendentes)
- Workflows
- Lixeira
- Configurações

### 2.3 Explorador de Documentos
**Templates:** `templates/explorador_de_documentos_1/` até `templates/explorador_de_documentos_5/`

**Funcionalidades:**
- Navegação por pastas hierárquicas (árvore de diretórios)
- Breadcrumb de navegação
- Visualização em Grid ou Lista
- Busca avançada com filtros
- Seleção múltipla de arquivos
- Ações em lote:
  - Adicionar Tag
  - Renomear
  - Mover
  - Excluir
- Upload de arquivos
- Preview de arquivos (thumbnails)
- Indicador de armazenamento

**Tipos de Arquivos Suportados:**
- PDF (ícone vermelho)
- DOCX (ícone azul)
- XLSX (ícone verde)
- Imagens (JPG, PNG)
- ZIP (ícone laranja)
- Figma (.fig)
- PowerPoint (.pptx)

**Organização:**
- Pastas por departamento (Marketing, Financeiro, Jurídico, RH)
- Pastas por projeto (Projetos 2024)
- Sistema de Tags coloridas

### 2.4 Visualizador de Documentos
**Template:** `templates/visualizador_de_documentos/code.html`

**Funcionalidades:**
- Visualização de documentos PDF em canvas
- Controles de zoom (+ / -)
- Navegação por páginas
- Ferramentas de anotação:
  - Seleção
  - Mão (pan)
  - Marca-texto (highlight)
  - Comentários
  - Desenho livre
- Download e impressão
- Status do documento (Aprovado, Em Revisão, etc.)
- Salvamento automático na nuvem
- Compartilhamento

**Painel Lateral:**
- Aba de Anotações/Comentários
- Aba de Miniaturas (thumbnails das páginas)
- Aba de Informações do documento

### 2.5 Sistema de Tags
**Template:** `templates/gerenciamento_de_tags/code.html`

**Funcionalidades:**
- CRUD de tags (Criar, Editar, Excluir)
- Tags com cores personalizadas
- Descrição da tag
- Contador de uso (documentos associados)
- Busca e filtro de tags
- Ordenação (Nome A-Z, Mais recentes, Mais usadas)
- Paginação

**Tags Padrão:**
- Urgente (vermelho)
- Em Revisão (laranja)
- Aprovado (verde)
- Confidencial (cinza)
- Financeiro (azul)
- Jurídico (vermelho)
- RH (verde)
- Projetos (roxo)
- Contabilidade (azul)

### 2.6 Compartilhamento e Permissões
**Template:** `templates/compartilhamento_e_permissões/code.html`

**Funcionalidades:**
- Adicionar pessoas ou grupos por nome/email
- Níveis de permissão:
  - Proprietário
  - Edição
  - Leitura
- Compartilhamento por link público
- Copiar link de compartilhamento
- Lista de pessoas com acesso
- Remoção de acesso
- Configurações avançadas

### 2.7 Colaboração em Tempo Real
**Template:** `templates/colaboração_em_tempo_real/code.html`

**Funcionalidades:**
- Edição colaborativa simultânea
- Cursores de colaboradores em tempo real (com nome e cor)
- Chat integrado ao documento
- Indicador de usuários online
- Status de atividade (Editando, Ocioso)
- Avatares dos participantes
- Salvamento automático
- Ferramentas de edição:
  - Seleção
  - Edição de texto
  - Comentários
  - Marca-texto
  - Desfazer/Refazer

**Painel de Colaboração:**
- Chat em tempo real
- Lista de participantes
- Gerenciamento de permissões por usuário
- Histórico de mensagens

### 2.8 Histórico de Versões
**Template:** `templates/histórico_de_versões/code.html`

**Funcionalidades:**
- Lista cronológica de versões
- Informações por versão:
  - Número da versão
  - Data/hora de modificação
  - Autor da modificação
  - Comentários/descrição das alterações
- Ações por versão:
  - Visualizar
  - Restaurar
  - Download
- Modo de comparação entre versões
- Upload de nova versão
- Compartilhamento do histórico
- Indicador de versão atual

### 2.9 Lixeira de Documentos
**Template:** `templates/lixeira_de_documentos/code.html`

**Funcionalidades:**
- Lista de documentos excluídos
- Informações exibidas:
  - Nome do documento
  - Caminho original
  - Data de exclusão
  - Quem excluiu
  - Tamanho
- Ações:
  - Restaurar documento
  - Excluir permanentemente
  - Esvaziar lixeira
- Filtros:
  - Data de exclusão
  - Tipo de arquivo
  - Excluído por
- Seleção múltipla
- Política de retenção: 30 dias antes da exclusão automática
- Paginação

### 2.10 Configurações da Conta
**Template:** `templates/configurações_da_conta/code.html`

**Funcionalidades:**

**Perfil:**
- Foto de perfil (upload/remoção)
- Nome completo
- E-mail
- Telefone
- Cargo

**Segurança:**
- Alteração de senha
- Autenticação de dois fatores (implícito)

**Notificações:**
- Documentos compartilhados
- Documento assinado
- Alertas de segurança
- Marketing e novidades

**Assinatura/Plano:**
- Visualização do plano atual (Ex: Plano Pro)
- Preço e ciclo de cobrança
- Limites (usuários, armazenamento)
- Próxima cobrança
- Método de pagamento
- Histórico de pagamentos
- Upgrade de plano

**Zona de Perigo:**
- Exclusão de conta

**Configurações Avançadas (Aba Avançado):**
**Templates:** `templates/configurações_da_conta_1/`, `templates/configurações_da_conta_2/`, `templates/configurações_da_conta_3/`

**Políticas de Compartilhamento e Acesso:**
- Expiração padrão de links (7 dias, 30 dias, 90 dias, Nunca)
- Permissões padrão para novos membros (Apenas Visualizar, Comentar, Editar)
- Restrição de download (impedir download de arquivos originais)
- Links públicos (permitir/bloquear criação de links sem login)

**Configuração de Marca d'água:**
- Ativar/desativar marca d'água em documentos
- Conteúdo personalizável (texto + variáveis: {EMAIL}, {DATA}, {IP})
- Posição (Centro Diagonal, Centro Horizontal, Cantos, Mosaico Repetido)
- Cor (seletor de cor)
- Tamanho (slider 10-100px)
- Opacidade (slider 0-100%)
- Pré-visualização em tempo real

**Segurança Adicional:**
- Timeout de sessão (desconectar após inatividade)
- Log de auditoria detalhado (registrar IP e user-agent)
- Visualização de logs de acesso

**Ações:**
- Salvar configurações
- Restaurar padrões (zona de perigo)

### 2.11 Controle de Workflow
**Templates:** `templates/controle_de_workflow_1/`, `templates/controle_de_workflow_2/`, `templates/controle_de_workflow_3/`

**Funcionalidades:**

**Editor Visual de Workflow:**
- Canvas com grid para desenho de fluxos
- Drag-and-drop de nós/etapas
- Conexões visuais entre etapas (setas SVG)
- Controles de zoom (+ / -)
- Salvamento automático com indicador de versão

**Tipos de Nós/Etapas:**
- Início (verde) - Ponto de entrada do fluxo
- Revisão (amarelo) - Etapa de revisão técnica
- Aprovação (azul) - Etapa de aprovação gerencial
- Condição (roxo/losango) - Decisão condicional (Se/Então)
- Publicação (verde) - Disponibilização automática
- Email (cinza) - Envio de notificação
- Fim (vermelho) - Encerramento do fluxo

**Painel de Propriedades da Etapa:**
- Nome da etapa
- Tipo de etapa (indicador visual)
- ID único do nó
- Aprovadores/Responsáveis:
  - Busca de usuários ou grupos
  - Lista de aprovadores atribuídos
  - Regra de aprovação (Qualquer um / Consenso de todos)
- Condições de Transição:
  - Regras Se/Então (Se Aprovado → Próxima, Se Rejeitado → Retornar)
  - Condições compostas (E, OU)
  - Comparações (Status, Valor do Documento, Número de Aprovações)
- Prazos e SLA:
  - Tempo limite (horas/dias úteis ou corridos)
  - Notificar gestor ao expirar
- Ações Automáticas:
  - Notificações por email
  - Alertas de atraso
- Botão de exclusão da etapa

**Estatísticas do Workflow:**
- Instâncias ativas
- Pendentes de revisão
- Tempo médio de conclusão
- Taxa de rejeição

**Ações Globais:**
- Histórico de alterações
- Salvar alterações
- Indicador de última modificação (usuário e timestamp)
- Status de validação do workflow

### 2.12 Minhas Tarefas de Workflow
**Template:** `templates/minhas_tarefas_de_workflow/code.html`

**Funcionalidades:**

**Dashboard de Tarefas:**
- Contadores:
  - Tarefas pendentes
  - Tarefas atrasadas
- Abas de filtro: Pendentes / Concluídas
- Busca por documento, ID ou responsável
- Filtros por Status e Prazo

**Lista de Tarefas (Master):**
- Ícone do tipo de documento (PDF, DOCX, XLSX, Imagem)
- Nome do documento
- ID do documento
- Remetente/Solicitante
- Tipo de tarefa (Aprovação Financeira, Revisão Técnica, Aprovação Final, etc.)
- Indicador de prazo:
  - Urgente (laranja)
  - No Prazo (verde)
  - Atrasado (vermelho)
  - Normal (cinza)
- Data de vencimento
- Seleção visual do item ativo

**Painel de Detalhes (Detail):**
- Badge do tipo de tarefa
- Título do documento
- Data de início do workflow
- Card do documento:
  - Ícone do tipo
  - Nome do arquivo
  - Tamanho e versão
  - Botões: Visualizar, Download
- Informações do contexto:
  - Solicitante (avatar + nome)
  - Departamento
  - Valor do contrato (se aplicável)
  - Centro de custo
- Histórico do Workflow (Timeline):
  - Etapas concluídas (verde)
  - Etapa atual (azul/primário)
  - Comentários de cada etapa
  - Data/hora e responsável

**Ações de Tarefa:**
- Aprovar (botão primário)
- Rejeitar (botão secundário/vermelho)
- Menu de mais opções (delegar, solicitar informações)

### 2.13 Relatórios de Auditoria
**Templates:** `templates/relatórios_de_auditoria_1/`, `templates/relatórios_de_auditoria_2/`

**Funcionalidades:**

**Filtros de Busca:**
- Período (Hoje, Ontem, Últimos 7 dias, Último mês, Últimos 3 meses, Personalizado)
- Usuário (busca com autocomplete)
- Tipo de Atividade:
  - Criação
  - Edição
  - Visualização
  - Exclusão
  - Compartilhamento
  - Restauração
- Nome do Documento (busca parcial ou exata)
- Botões: Limpar filtros, Aplicar filtros

**Tabela de Logs:**
- Colunas:
  - Data & Hora
  - Usuário (avatar + nome + email)
  - Ação (badge colorido por tipo)
  - Documento (link clicável ou riscado se excluído)
  - IP Address
  - Detalhes (botão de visualização)
- Ordenação por coluna
- Hover highlight nas linhas

**Badges de Ação:**
- Edição (âmbar/laranja)
- Exclusão (vermelho)
- Compartilhamento (azul)
- Visualização (cinza)
- Criação (verde)
- Restauração (roxo)

**Paginação:**
- Indicador de resultados (Ex: "Exibindo 1-5 de 128 resultados")
- Navegação por páginas
- Seleção de itens por página

**Ações Globais:**
- Configurar Alertas
- Exportar CSV

### 2.14 Upload de Arquivos
**Templates:** `templates/upload_de_arquivos_1/`, `templates/upload_de_arquivos_2/`

**Funcionalidades:**

**Modal de Upload:**
- Título e descrição
- Botão de fechar

**Zona de Drag-and-Drop:**
- Área visual destacada com borda tracejada
- Ícone de upload na nuvem
- Texto: "Arraste e solte seus arquivos aqui"
- Formatos suportados: PDF, DOCX, XLSX, PNG, JPG
- Limite de tamanho: até 50MB por arquivo
- Botão alternativo: "Selecionar Arquivos"
- Input file oculto (múltiplos arquivos)

**Lista de Arquivos:**
- Contador de arquivos
- Status geral (Em progresso, Concluído)

**Item de Arquivo em Upload:**
- Ícone do tipo de arquivo
- Nome do arquivo
- Barra de progresso com porcentagem
- Indicador de bytes transferidos
- Botão de cancelar/remover

**Item de Arquivo Concluído:**
- Ícone do tipo de arquivo
- Nome do arquivo
- Tamanho total
- Badge de sucesso (verde)
- Botão de excluir

**Formulário de Metadados (por arquivo):**
- Pasta de Destino (select com opções hierárquicas)
- Tags (input com chips/badges removíveis)
- Descrição (textarea)

**Rodapé do Modal:**
- Resumo: Total de arquivos e tamanho
- Botão Cancelar
- Botão Finalizar Upload (desabilitado durante uploads)

---

## 3. Requisitos Não-Funcionais

### 3.1 Interface e Usabilidade
- Design responsivo (mobile-first)
- Suporte a tema claro e escuro
- Fonte: Inter (display), Noto Sans (body)
- Ícones: Material Symbols Outlined
- Framework CSS: Tailwind CSS
- Cor primária: #135bec (azul)

### 3.2 Segurança
- Autenticação SSO (Google, Microsoft)
- Criptografia de dados
- Conformidade ISO 27001
- Proteção reCAPTCHA
- Controle granular de permissões
- Alertas de segurança

### 3.3 Performance
- Salvamento automático
- Sincronização em tempo real
- Lazy loading de conteúdo
- Paginação de listas

### 3.4 Armazenamento
- Indicador visual de uso
- Planos com limites configuráveis (Ex: 10GB, 20GB, 100GB)
- Opção de upgrade

---

## 4. Integrações Sugeridas

Com base nos templates e no arquivo `mcp.json`, o sistema pode integrar com:

- **AWS Services** (DynamoDB, Lambda, Serverless)
- **Stripe** (pagamentos e assinaturas)
- **Google/Microsoft** (SSO)
- **Serviços de OCR** (digitalização)
- **Playwright** (testes automatizados)

---

## 5. Estrutura de Dados Sugerida

### 5.1 Entidades Principais

```
Perfil
├── id
├── nome (Administrador, Gestor, Usuário Padrão, Auditor, Visitante)
├── descricao
├── nivel_tecnico (Alto, Médio, Básico)
├── ativo
└── data_criacao

Permissao
├── id
├── codigo (ex: USUARIO_CRIAR, DOCUMENTO_APROVAR, LOG_VISUALIZAR)
├── nome
├── descricao
├── modulo (usuarios, documentos, sistema, relatorios, auditoria)
└── ativo

Perfil_Permissao (N:N)
├── perfil_id
├── permissao_id
└── data_atribuicao

Usuário
├── id
├── nome
├── email
├── telefone
├── cargo
├── foto_perfil
├── perfil_id (FK → Perfil)
├── setor_id (FK → Setor)
├── plano_id
├── ativo
├── ultimo_acesso
└── data_criacao

Setor
├── id
├── nome (Marketing, Financeiro, Jurídico, RH, Design)
├── gestor_id (FK → Usuário com perfil Gestor)
├── descricao
└── ativo

Documento
├── id
├── nome
├── tipo (pdf, docx, xlsx, etc.)
├── tamanho
├── pasta_id
├── proprietario_id
├── status (aprovado, em_revisao, rascunho)
├── data_criacao
├── data_modificacao
└── excluido_em (soft delete)

Pasta
├── id
├── nome
├── pasta_pai_id
├── proprietario_id
└── data_criacao

Versão
├── id
├── documento_id
├── numero_versao
├── autor_id
├── comentario
├── arquivo_url
└── data_criacao

Tag
├── id
├── nome
├── cor
├── descricao
└── organizacao_id

Compartilhamento
├── id
├── documento_id (ou pasta_id)
├── usuario_id (ou grupo_id)
├── permissao (leitura, edicao, proprietario)
└── data_compartilhamento

Comentário
├── id
├── documento_id
├── versao_id
├── autor_id
├── conteudo
├── pagina
├── posicao_x
├── posicao_y
└── data_criacao

Atividade
├── id
├── usuario_id
├── tipo_acao
├── documento_id
├── descricao
└── data

Log_Auditoria
├── id
├── usuario_id
├── acao (LOGIN, LOGOUT, CRIAR, EDITAR, EXCLUIR, COMPARTILHAR, APROVAR, EXPORTAR)
├── entidade (documento, pasta, usuario, configuracao)
├── entidade_id
├── dados_anteriores (JSON)
├── dados_novos (JSON)
├── ip_address
├── user_agent
├── data_hora

Aprovacao
├── id
├── documento_id
├── solicitante_id (FK → Usuário)
├── aprovador_id (FK → Usuário com perfil Gestor)
├── status (pendente, aprovado, rejeitado)
├── comentario
├── data_solicitacao
└── data_decisao

Documento_Publico
├── id
├── documento_id
├── token_acesso (para links públicos)
├── permite_download
├── data_expiracao
├── criado_por_id
└── data_criacao

Sessao_Usuario
├── id
├── usuario_id
├── token
├── ip_address
├── user_agent
├── data_inicio
├── data_ultimo_acesso
└── data_expiracao

Workflow
├── id
├── nome
├── descricao
├── versao
├── status (rascunho, ativo, inativo, arquivado)
├── criado_por_id (FK → Usuário)
├── setor_id (FK → Setor)
├── data_criacao
├── data_modificacao
└── configuracao_json (estrutura do fluxo visual)

Workflow_Etapa
├── id
├── workflow_id (FK → Workflow)
├── tipo (inicio, revisao, aprovacao, condicao, publicacao, email, fim)
├── nome
├── ordem
├── posicao_x
├── posicao_y
├── configuracao_json (aprovadores, regras, SLA)
├── etapa_anterior_id (FK → Workflow_Etapa, nullable)
├── etapa_proxima_aprovado_id (FK → Workflow_Etapa, nullable)
└── etapa_proxima_rejeitado_id (FK → Workflow_Etapa, nullable)

Workflow_Instancia
├── id
├── workflow_id (FK → Workflow)
├── documento_id (FK → Documento)
├── status (em_andamento, concluido, cancelado, pausado)
├── etapa_atual_id (FK → Workflow_Etapa)
├── iniciado_por_id (FK → Usuário)
├── data_inicio
├── data_conclusao
└── dados_contexto_json (valores dinâmicos do fluxo)

Tarefa_Workflow
├── id
├── workflow_instancia_id (FK → Workflow_Instancia)
├── workflow_etapa_id (FK → Workflow_Etapa)
├── responsavel_id (FK → Usuário)
├── status (pendente, em_analise, aprovado, rejeitado, delegado)
├── prioridade (normal, urgente)
├── prazo
├── comentario
├── data_criacao
├── data_conclusao
└── delegado_para_id (FK → Usuário, nullable)

Configuracao_Compartilhamento
├── id
├── usuario_id (FK → Usuário)
├── expiracao_padrao_links (dias)
├── permissao_padrao (leitura, comentar, edicao)
├── restringir_download (boolean)
├── permitir_links_publicos (boolean)
└── data_modificacao

Configuracao_Marca_Agua
├── id
├── usuario_id (FK → Usuário)
├── ativo (boolean)
├── conteudo (texto com variáveis)
├── posicao (centro_diagonal, centro_horizontal, topo_esquerdo, etc.)
├── cor (hex)
├── tamanho (px)
├── opacidade (0-100)
└── data_modificacao
```

### 5.2 Matriz de Permissões por Perfil

| Permissão | Administrador | Gestor | Usuário Padrão | Auditor | Visitante |
|-----------|:-------------:|:------:|:--------------:|:-------:|:---------:|
| **USUÁRIOS** |
| USUARIO_CRIAR | ✓ | | | | |
| USUARIO_EDITAR | ✓ | | | | |
| USUARIO_EXCLUIR | ✓ | | | | |
| USUARIO_LISTAR | ✓ | ✓ | | ✓ | |
| **DOCUMENTOS** |
| DOCUMENTO_UPLOAD | ✓ | ✓ | ✓ | | |
| DOCUMENTO_EDITAR | ✓ | ✓ | ✓ | | |
| DOCUMENTO_EXCLUIR | ✓ | ✓ | ✓* | | |
| DOCUMENTO_VISUALIZAR | ✓ | ✓ | ✓ | ✓ | ✓** |
| DOCUMENTO_COMPARTILHAR | ✓ | ✓ | ✓ | | |
| DOCUMENTO_APROVAR | ✓ | ✓ | | | |
| DOCUMENTO_PUBLICAR | ✓ | ✓ | | | |
| **PASTAS** |
| PASTA_CRIAR | ✓ | ✓ | ✓ | | |
| PASTA_EDITAR | ✓ | ✓ | ✓* | | |
| PASTA_EXCLUIR | ✓ | ✓ | | | |
| **TAGS** |
| TAG_CRIAR | ✓ | ✓ | | | |
| TAG_EDITAR | ✓ | ✓ | | | |
| TAG_EXCLUIR | ✓ | | | | |
| TAG_ATRIBUIR | ✓ | ✓ | ✓ | | |
| **RELATÓRIOS** |
| RELATORIO_SETOR | ✓ | ✓ | | | |
| RELATORIO_GERAL | ✓ | | | ✓ | |
| RELATORIO_EXPORTAR | ✓ | ✓ | | ✓ | |
| **AUDITORIA** |
| LOG_VISUALIZAR | ✓ | | | ✓ | |
| LOG_EXPORTAR | ✓ | | | ✓ | |
| **SISTEMA** |
| CONFIG_SISTEMA | ✓ | | | | |
| BACKUP_EXECUTAR | ✓ | | | | |
| BACKUP_RESTAURAR | ✓ | | | | |
| MANUTENCAO | ✓ | | | | |

*Apenas documentos próprios  
**Apenas documentos públicos

---

## 6. Especificação Técnica por Perfil

### 6.1 Perfil: Administrador

**Descrição:** Usuário com nível técnico alto, responsável pela gestão completa do sistema, usuários, configurações, backup e manutenção.

#### 6.1.1 Módulo: Painel Administrativo

**Rota:** `/admin`

**Funcionalidades:**

**Dashboard Administrativo**
- Métricas do sistema:
  - Total de usuários (ativos/inativos)
  - Usuários online em tempo real
  - Armazenamento total utilizado vs. disponível
  - Documentos criados (hoje/semana/mês)
  - Erros e alertas do sistema
- Gráficos:
  - Crescimento de usuários (últimos 12 meses)
  - Uso de armazenamento por setor
  - Atividade por hora do dia
  - Top 10 usuários mais ativos

#### 6.1.2 Módulo: Gestão de Usuários

**Rota:** `/admin/usuarios`

**Funcionalidades:**

**Listagem de Usuários**
- Tabela com colunas: Avatar, Nome, Email, Perfil, Setor, Status, Último Acesso, Ações
- Filtros: Perfil, Setor, Status (Ativo/Inativo), Data de criação
- Busca por nome ou email
- Ordenação por qualquer coluna
- Exportação para CSV/Excel
- Paginação (10, 25, 50, 100 por página)

**Criar Usuário**
```
POST /api/admin/usuarios
Body:
{
  "nome": string (obrigatório, 3-100 chars),
  "email": string (obrigatório, email válido, único),
  "senha_temporaria": string (obrigatório, min 8 chars),
  "perfil_id": number (obrigatório),
  "setor_id": number (opcional),
  "cargo": string (opcional),
  "telefone": string (opcional),
  "enviar_email_boas_vindas": boolean
}
Response: 201 Created
```

**Editar Usuário**
```
PUT /api/admin/usuarios/{id}
Body:
{
  "nome": string,
  "email": string,
  "perfil_id": number,
  "setor_id": number,
  "cargo": string,
  "telefone": string,
  "ativo": boolean
}
Response: 200 OK
```

**Desativar/Reativar Usuário**
```
PATCH /api/admin/usuarios/{id}/status
Body: { "ativo": boolean }
Response: 200 OK
```

**Resetar Senha**
```
POST /api/admin/usuarios/{id}/reset-senha
Body: { "enviar_email": boolean }
Response: 200 OK (retorna senha temporária se enviar_email=false)
```

**Excluir Usuário**
```
DELETE /api/admin/usuarios/{id}
Response: 204 No Content
Regras:
- Soft delete (marca como excluído)
- Transfere documentos para outro usuário ou para "Órfãos"
- Não permite excluir o próprio usuário
- Não permite excluir se for o único Administrador
```

#### 6.1.3 Módulo: Gestão de Setores

**Rota:** `/admin/setores`

**Funcionalidades:**
- CRUD completo de setores
- Atribuição de Gestor responsável
- Visualização de usuários por setor
- Estatísticas: documentos, armazenamento usado

**API:**
```
GET    /api/admin/setores
POST   /api/admin/setores
PUT    /api/admin/setores/{id}
DELETE /api/admin/setores/{id}
GET    /api/admin/setores/{id}/usuarios
GET    /api/admin/setores/{id}/estatisticas
```

#### 6.1.4 Módulo: Configurações do Sistema

**Rota:** `/admin/configuracoes`

**Abas:**

**Geral**
- Nome da organização
- Logo (upload)
- Fuso horário padrão
- Idioma padrão
- Formato de data

**Armazenamento**
- Limite padrão por usuário
- Tipos de arquivo permitidos (whitelist)
- Tamanho máximo por arquivo
- Política de retenção da lixeira (dias)

**Segurança**
- Força mínima de senha
- Expiração de senha (dias)
- Tentativas máximas de login
- Tempo de bloqueio após falhas
- Obrigar 2FA para perfis específicos
- Tempo de expiração de sessão
- IPs permitidos (whitelist opcional)

**Email**
- Configuração SMTP
- Templates de email (boas-vindas, reset senha, notificações)
- Email remetente padrão

**Integrações**
- Configuração SSO (Google, Microsoft)
- Webhooks para eventos
- API Keys para integrações externas

**API:**
```
GET  /api/admin/configuracoes
PUT  /api/admin/configuracoes
POST /api/admin/configuracoes/testar-email
POST /api/admin/configuracoes/testar-sso
```

#### 6.1.5 Módulo: Backup e Restauração

**Rota:** `/admin/backup`

**Funcionalidades:**

**Backup Manual**
- Executar backup completo sob demanda
- Selecionar escopo: Banco de dados, Arquivos, Ambos
- Download do backup gerado

**Backup Automático**
- Configurar frequência (diário, semanal, mensal)
- Horário de execução
- Retenção (quantos backups manter)
- Destino: Local, S3, ambos

**Histórico de Backups**
- Lista de backups realizados
- Status: Sucesso, Falha, Em andamento
- Tamanho, duração, data/hora
- Ações: Download, Restaurar, Excluir

**Restauração**
- Selecionar backup para restaurar
- Confirmação com senha do administrador
- Modo: Completo ou Seletivo (apenas banco ou apenas arquivos)
- Log de restauração em tempo real

**API:**
```
POST   /api/admin/backup/executar
GET    /api/admin/backup/historico
GET    /api/admin/backup/{id}/download
POST   /api/admin/backup/{id}/restaurar
DELETE /api/admin/backup/{id}
GET    /api/admin/backup/configuracao
PUT    /api/admin/backup/configuracao
```

#### 6.1.6 Módulo: Logs e Auditoria

**Rota:** `/admin/logs`

**Funcionalidades:**
- Visualização de todos os logs do sistema
- Filtros avançados:
  - Período (data início/fim)
  - Usuário
  - Tipo de ação
  - Entidade afetada
  - IP de origem
- Detalhes do log: dados antes/depois (diff)
- Exportação para CSV/JSON
- Alertas configuráveis (ex: múltiplas falhas de login)

**API:**
```
GET  /api/admin/logs?filtros...
GET  /api/admin/logs/{id}
GET  /api/admin/logs/exportar?formato=csv|json
POST /api/admin/logs/alertas
```

#### 6.1.7 Módulo: Manutenção

**Rota:** `/admin/manutencao`

**Funcionalidades:**

**Modo Manutenção**
- Ativar/desativar modo manutenção
- Mensagem personalizada para usuários
- Permitir acesso apenas a Administradores

**Tarefas de Manutenção**
- Limpar cache do sistema
- Reindexar documentos para busca
- Limpar sessões expiradas
- Esvaziar lixeira (documentos expirados)
- Verificar integridade de arquivos
- Otimizar banco de dados

**Monitoramento**
- Status dos serviços (API, Storage, Banco, Cache)
- Uso de CPU/Memória
- Filas de processamento
- Erros recentes

**API:**
```
POST /api/admin/manutencao/modo
POST /api/admin/manutencao/limpar-cache
POST /api/admin/manutencao/reindexar
POST /api/admin/manutencao/limpar-sessoes
POST /api/admin/manutencao/esvaziar-lixeira
POST /api/admin/manutencao/verificar-integridade
GET  /api/admin/manutencao/status
```

#### 6.1.8 Interface do Administrador

**Menu Lateral (adicional ao menu padrão):**
```
📊 Admin
├── Dashboard Admin
├── Usuários
├── Setores
├── Configurações
├── Backup
├── Logs
└── Manutenção
```

**Indicadores Visuais:**
- Badge vermelho no menu Admin quando há alertas
- Notificações de sistema (erros, backups, etc.)
- Banner de modo manutenção ativo

#### 6.1.9 Regras de Negócio

1. Deve existir pelo menos 1 Administrador ativo no sistema
2. Administrador não pode rebaixar o próprio perfil
3. Ações críticas (excluir usuário, restaurar backup) exigem confirmação de senha
4. Todas as ações do Administrador são registradas em log
5. Backup automático não pode ser desativado, apenas configurado
6. Modo manutenção desconecta usuários não-admin após 5 minutos
7. Configurações de segurança têm valores mínimos obrigatórios

#### 6.1.10 Endpoints Resumo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/admin/dashboard | Métricas do painel admin |
| GET | /api/admin/usuarios | Listar usuários |
| POST | /api/admin/usuarios | Criar usuário |
| PUT | /api/admin/usuarios/{id} | Editar usuário |
| DELETE | /api/admin/usuarios/{id} | Excluir usuário |
| PATCH | /api/admin/usuarios/{id}/status | Ativar/desativar |
| POST | /api/admin/usuarios/{id}/reset-senha | Resetar senha |
| GET | /api/admin/setores | Listar setores |
| POST | /api/admin/setores | Criar setor |
| PUT | /api/admin/setores/{id} | Editar setor |
| DELETE | /api/admin/setores/{id} | Excluir setor |
| GET | /api/admin/configuracoes | Obter configurações |
| PUT | /api/admin/configuracoes | Salvar configurações |
| POST | /api/admin/backup/executar | Executar backup |
| GET | /api/admin/backup/historico | Histórico de backups |
| POST | /api/admin/backup/{id}/restaurar | Restaurar backup |
| GET | /api/admin/logs | Consultar logs |
| POST | /api/admin/manutencao/{acao} | Executar manutenção |

---

### 6.2 Perfil: Gestor

**Descrição:** Usuário com nível técnico médio, responsável por supervisionar documentos do seu setor, aprovar/rejeitar documentos, organizar estrutura de pastas e gerar relatórios departamentais.

#### 6.2.1 Módulo: Dashboard do Gestor

**Rota:** `/gestor`

**Funcionalidades:**

**Visão Geral do Setor**
- Métricas do setor:
  - Total de documentos do setor
  - Documentos pendentes de aprovação
  - Documentos aprovados (semana/mês)
  - Documentos rejeitados (semana/mês)
  - Armazenamento utilizado pelo setor
- Cards de ação rápida:
  - Aprovar Documentos (com contador)
  - Novo Documento
  - Organizar Pastas
  - Gerar Relatório
- Lista de documentos recentes do setor
- Atividade recente da equipe

**Equipe do Setor**
- Lista de membros do setor
- Status online/offline
- Documentos por membro
- Último acesso

#### 6.2.2 Módulo: Aprovação de Documentos

**Rota:** `/gestor/aprovacoes`

**Funcionalidades:**

**Fila de Aprovação**
- Lista de documentos pendentes de aprovação
- Informações exibidas:
  - Thumbnail do documento
  - Nome do documento
  - Solicitante
  - Data da solicitação
  - Prioridade (Normal, Urgente)
  - Tags associadas
- Ordenação: Mais antigos primeiro, Urgentes primeiro, Recentes
- Filtros: Tipo de arquivo, Solicitante, Período

**Visualização para Aprovação**
- Preview do documento completo
- Histórico de versões
- Comentários anteriores
- Informações do solicitante

**Ações de Aprovação**
```
POST /api/gestor/aprovacoes/{id}/aprovar
Body:
{
  "comentario": string (opcional),
  "notificar_solicitante": boolean (default: true)
}
Response: 200 OK
```

```
POST /api/gestor/aprovacoes/{id}/rejeitar
Body:
{
  "motivo": string (obrigatório, min 10 chars),
  "sugestoes": string (opcional),
  "notificar_solicitante": boolean (default: true)
}
Response: 200 OK
```

```
POST /api/gestor/aprovacoes/{id}/solicitar-revisao
Body:
{
  "comentario": string (obrigatório),
  "itens_revisao": string[] (lista de pontos a revisar),
  "prazo": date (opcional)
}
Response: 200 OK
```

**Aprovação em Lote**
```
POST /api/gestor/aprovacoes/lote
Body:
{
  "documento_ids": number[],
  "acao": "aprovar" | "rejeitar",
  "comentario": string
}
Response: 200 OK
```

#### 6.2.3 Módulo: Organização do Setor

**Rota:** `/gestor/organizacao`

**Funcionalidades:**

**Estrutura de Pastas do Setor**
- Visualização em árvore das pastas do setor
- Criar/Editar/Excluir pastas
- Mover documentos entre pastas
- Definir pastas padrão (Ex: "Aprovados", "Em Revisão", "Arquivados")

**Gestão de Tags do Setor**
- Criar tags específicas do setor
- Atribuir tags em lote
- Padronizar nomenclatura

**Políticas do Setor**
- Definir tipos de arquivo permitidos no setor
- Nomenclatura padrão de documentos
- Fluxo de aprovação obrigatório (sim/não por pasta)
- Retenção de documentos (arquivamento automático)

**API:**
```
GET    /api/gestor/pastas
POST   /api/gestor/pastas
PUT    /api/gestor/pastas/{id}
DELETE /api/gestor/pastas/{id}
POST   /api/gestor/pastas/{id}/mover-documentos
Body: { "documento_ids": number[], "pasta_destino_id": number }

GET    /api/gestor/tags
POST   /api/gestor/tags
PUT    /api/gestor/tags/{id}
DELETE /api/gestor/tags/{id}
POST   /api/gestor/documentos/atribuir-tags
Body: { "documento_ids": number[], "tag_ids": number[] }

GET    /api/gestor/politicas
PUT    /api/gestor/politicas
```

#### 6.2.4 Módulo: Relatórios do Setor

**Rota:** `/gestor/relatorios`

**Tipos de Relatório:**

**Relatório de Atividades**
- Período selecionável
- Documentos criados/editados/excluídos
- Atividade por usuário
- Gráfico de timeline

**Relatório de Aprovações**
- Total aprovado vs. rejeitado
- Tempo médio de aprovação
- Taxa de aprovação por solicitante
- Motivos de rejeição mais comuns

**Relatório de Armazenamento**
- Uso por tipo de arquivo
- Uso por usuário
- Crescimento ao longo do tempo
- Projeção de uso futuro

**Relatório de Documentos**
- Inventário completo do setor
- Documentos por status
- Documentos por tag
- Documentos sem atividade (possíveis arquivamentos)

**Exportação:**
- PDF (formatado para impressão)
- Excel (dados tabulares)
- CSV (dados brutos)

**API:**
```
GET /api/gestor/relatorios/atividades?data_inicio=&data_fim=
GET /api/gestor/relatorios/aprovacoes?data_inicio=&data_fim=
GET /api/gestor/relatorios/armazenamento
GET /api/gestor/relatorios/documentos?filtros...

POST /api/gestor/relatorios/exportar
Body:
{
  "tipo": "atividades" | "aprovacoes" | "armazenamento" | "documentos",
  "formato": "pdf" | "excel" | "csv",
  "filtros": object
}
Response: { "download_url": string }
```

#### 6.2.5 Módulo: Supervisão da Equipe

**Rota:** `/gestor/equipe`

**Funcionalidades:**

**Visão da Equipe**
- Lista de membros do setor
- Métricas por membro:
  - Documentos criados
  - Documentos compartilhados
  - Taxa de aprovação (docs aprovados/rejeitados)
  - Armazenamento utilizado
  - Última atividade

**Atividade da Equipe**
- Feed de atividades do setor
- Filtro por membro
- Filtro por tipo de ação

**Notificações para Equipe**
```
POST /api/gestor/equipe/notificar
Body:
{
  "usuario_ids": number[] (vazio = todos do setor),
  "titulo": string,
  "mensagem": string,
  "prioridade": "normal" | "alta"
}
Response: 200 OK
```

**API:**
```
GET /api/gestor/equipe
GET /api/gestor/equipe/{usuario_id}/metricas
GET /api/gestor/equipe/atividades?filtros...
POST /api/gestor/equipe/notificar
```

#### 6.2.6 Interface do Gestor

**Menu Lateral (adicional ao menu padrão):**
```
📋 Gestor
├── Dashboard Setor
├── Aprovações (badge com pendentes)
├── Organização
│   ├── Pastas
│   ├── Tags
│   └── Políticas
├── Relatórios
└── Equipe
```

**Indicadores Visuais:**
- Badge vermelho no menu "Aprovações" com número de pendentes
- Notificação de novos documentos para aprovar
- Indicador de documentos urgentes
- Status da equipe (online/offline)

**Notificações Específicas:**
- Novo documento aguardando aprovação
- Documento urgente submetido
- Limite de armazenamento do setor próximo
- Membro inativo há X dias

#### 6.2.7 Fluxo de Aprovação

```
┌─────────────────┐
│ Usuário cria    │
│ documento       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Documento em    │
│ status RASCUNHO │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Usuário submete │
│ para aprovação  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Status muda p/  │
│ EM_REVISAO      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Gestor recebe   │────▶│ Notificação     │
│ na fila         │     │ enviada         │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Gestor analisa  │
│ documento       │
└────────┬────────┘
         │
    ┌────┴────┬─────────────┐
    ▼         ▼             ▼
┌───────┐ ┌───────┐   ┌───────────┐
│APROVAR│ │REJEITAR│   │SOLICITAR  │
└───┬───┘ └───┬───┘   │REVISÃO    │
    │         │       └─────┬─────┘
    ▼         ▼             │
┌───────┐ ┌───────┐         │
│Status:│ │Status:│         │
│APROVADO│ │REJEITADO│       │
└───────┘ └───────┘         │
                            ▼
                    ┌───────────────┐
                    │ Volta para    │
                    │ usuário editar│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Resubmete p/  │
                    │ aprovação     │
                    └───────────────┘
```

#### 6.2.8 Regras de Negócio

1. Gestor só visualiza/gerencia documentos do seu setor
2. Gestor não pode aprovar documentos próprios (conflito de interesse)
3. Documentos rejeitados 3x consecutivas são arquivados automaticamente
4. Aprovação em lote limitada a 50 documentos por vez
5. Relatórios só incluem dados do setor do Gestor
6. Gestor pode delegar aprovação temporária a outro usuário do setor
7. Documentos urgentes aparecem no topo da fila com destaque visual
8. Prazo padrão de aprovação: 5 dias úteis (configurável)
9. Notificação automática se documento pendente há mais de 3 dias

#### 6.2.9 Endpoints Resumo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/gestor/dashboard | Métricas do setor |
| GET | /api/gestor/aprovacoes | Fila de aprovação |
| POST | /api/gestor/aprovacoes/{id}/aprovar | Aprovar documento |
| POST | /api/gestor/aprovacoes/{id}/rejeitar | Rejeitar documento |
| POST | /api/gestor/aprovacoes/{id}/solicitar-revisao | Pedir revisão |
| POST | /api/gestor/aprovacoes/lote | Aprovação em lote |
| GET | /api/gestor/pastas | Listar pastas do setor |
| POST | /api/gestor/pastas | Criar pasta |
| PUT | /api/gestor/pastas/{id} | Editar pasta |
| DELETE | /api/gestor/pastas/{id} | Excluir pasta |
| POST | /api/gestor/pastas/{id}/mover-documentos | Mover documentos |
| GET | /api/gestor/tags | Listar tags do setor |
| POST | /api/gestor/tags | Criar tag |
| POST | /api/gestor/documentos/atribuir-tags | Atribuir tags em lote |
| GET | /api/gestor/politicas | Obter políticas |
| PUT | /api/gestor/politicas | Salvar políticas |
| GET | /api/gestor/relatorios/{tipo} | Gerar relatório |
| POST | /api/gestor/relatorios/exportar | Exportar relatório |
| GET | /api/gestor/equipe | Listar equipe |
| GET | /api/gestor/equipe/{id}/metricas | Métricas do membro |
| GET | /api/gestor/equipe/atividades | Feed de atividades |
| POST | /api/gestor/equipe/notificar | Notificar equipe |

---

### 6.3 Perfil: Auditor

**Descrição:** Usuário com nível técnico médio, responsável por monitorar conformidade do sistema, analisar logs de auditoria e gerar relatórios de compliance. Acesso somente leitura aos documentos e dados do sistema.

#### 6.3.1 Módulo: Dashboard do Auditor

**Rota:** `/auditor`

**Funcionalidades:**

**Visão Geral de Conformidade**
- Métricas principais:
  - Total de ações registradas (hoje/semana/mês)
  - Alertas de segurança ativos
  - Usuários com atividade suspeita
  - Documentos sensíveis acessados
  - Taxa de conformidade geral
- Gráficos:
  - Atividade por hora (últimas 24h)
  - Ações por tipo (login, upload, download, etc.)
  - Top 10 usuários mais ativos
  - Acessos por setor

**Alertas Recentes**
- Lista de alertas de segurança
- Severidade: Crítico, Alto, Médio, Baixo
- Status: Novo, Em análise, Resolvido

#### 6.3.2 Módulo: Análise de Logs

**Rota:** `/auditor/logs`

**Funcionalidades:**

**Consulta de Logs**
- Busca avançada com filtros:
  - Período (data/hora início e fim)
  - Usuário específico
  - Tipo de ação (LOGIN, LOGOUT, CRIAR, EDITAR, EXCLUIR, COMPARTILHAR, DOWNLOAD, VISUALIZAR)
  - Entidade (documento, pasta, usuario, configuracao)
  - IP de origem
  - Resultado (sucesso, falha)
- Visualização em tabela com colunas configuráveis
- Detalhes expandidos por registro (dados antes/depois)
- Paginação e ordenação

**Análise de Sessões**
- Histórico de sessões por usuário
- Duração média de sessão
- IPs utilizados
- Dispositivos/navegadores
- Sessões simultâneas

**Detecção de Anomalias**
- Múltiplas falhas de login
- Acesso fora do horário comercial
- Download em massa
- Acesso de IP desconhecido
- Alterações em documentos sensíveis

**API:**
```
GET /api/auditor/logs
Query params:
  - data_inicio: datetime
  - data_fim: datetime
  - usuario_id: number
  - acao: string
  - entidade: string
  - ip: string
  - resultado: "sucesso" | "falha"
  - pagina: number
  - por_pagina: number
  - ordenar_por: string
  - ordem: "asc" | "desc"
Response: { logs: Log[], total: number, paginas: number }

GET /api/auditor/logs/{id}
Response: Log (com dados_anteriores e dados_novos)

GET /api/auditor/sessoes
Query params: usuario_id, data_inicio, data_fim
Response: { sessoes: Sessao[], estatisticas: object }

GET /api/auditor/anomalias
Query params: tipo, severidade, status, data_inicio, data_fim
Response: { anomalias: Anomalia[] }
```

#### 6.3.3 Módulo: Relatórios de Auditoria

**Rota:** `/auditor/relatorios`

**Tipos de Relatório:**

**Relatório de Acesso**
- Quem acessou o quê e quando
- Filtro por documento, usuário, período
- Inclui visualizações, downloads, edições

**Relatório de Segurança**
- Tentativas de login (sucesso/falha)
- Alterações de senha
- Ativações/desativações de 2FA
- Acessos de IPs suspeitos
- Alterações de permissões

**Relatório de Conformidade**
- Documentos sem backup
- Usuários sem atividade (possíveis contas órfãs)
- Documentos expirados não arquivados
- Permissões excessivas
- Violações de política

**Relatório de Atividade por Usuário**
- Histórico completo de um usuário
- Timeline de ações
- Documentos acessados
- Padrões de uso

**Relatório de Documentos Sensíveis**
- Documentos com tag "Confidencial"
- Histórico de acessos
- Compartilhamentos ativos
- Alterações recentes

**Agendamento de Relatórios**
- Gerar automaticamente (diário, semanal, mensal)
- Enviar por email
- Armazenar histórico

**API:**
```
GET /api/auditor/relatorios/acesso?filtros...
GET /api/auditor/relatorios/seguranca?filtros...
GET /api/auditor/relatorios/conformidade
GET /api/auditor/relatorios/usuario/{id}?filtros...
GET /api/auditor/relatorios/documentos-sensiveis?filtros...

POST /api/auditor/relatorios/exportar
Body:
{
  "tipo": string,
  "formato": "pdf" | "excel" | "csv",
  "filtros": object
}
Response: { download_url: string }

GET /api/auditor/relatorios/agendados
POST /api/auditor/relatorios/agendar
Body:
{
  "tipo": string,
  "frequencia": "diario" | "semanal" | "mensal",
  "hora_execucao": string,
  "email_destino": string[],
  "formato": string
}
DELETE /api/auditor/relatorios/agendados/{id}
```

#### 6.3.4 Módulo: Gestão de Alertas

**Rota:** `/auditor/alertas`

**Funcionalidades:**

**Configuração de Alertas**
- Definir regras de alerta:
  - Condição (ex: falhas de login > 5 em 10 min)
  - Severidade
  - Ação (notificar, bloquear usuário)
  - Destinatários

**Tipos de Alerta Pré-configurados:**
| Alerta | Condição | Severidade |
|--------|----------|------------|
| Força bruta | 5+ falhas de login em 10 min | Crítico |
| Acesso suspeito | Login de novo IP/dispositivo | Médio |
| Download em massa | 50+ downloads em 1 hora | Alto |
| Horário incomum | Acesso entre 22h-6h | Baixo |
| Documento sensível | Acesso a doc confidencial | Médio |
| Permissão alterada | Mudança de perfil de usuário | Alto |

**Gestão de Alertas Ativos**
- Marcar como "Em análise"
- Adicionar notas/comentários
- Resolver com justificativa
- Escalar para Administrador

**API:**
```
GET /api/auditor/alertas
Query: status, severidade, tipo, data_inicio, data_fim

GET /api/auditor/alertas/{id}

PATCH /api/auditor/alertas/{id}
Body:
{
  "status": "em_analise" | "resolvido",
  "notas": string,
  "justificativa": string (obrigatório se resolvido)
}

GET /api/auditor/alertas/configuracoes
POST /api/auditor/alertas/configuracoes
PUT /api/auditor/alertas/configuracoes/{id}
DELETE /api/auditor/alertas/configuracoes/{id}
```

#### 6.3.5 Módulo: Visualização de Documentos (Somente Leitura)

**Rota:** `/auditor/documentos`

**Funcionalidades:**
- Buscar qualquer documento do sistema
- Visualizar conteúdo (sem edição)
- Ver metadados completos
- Ver histórico de versões
- Ver histórico de acessos
- Ver compartilhamentos ativos
- Não pode: editar, excluir, compartilhar, fazer download

**API:**
```
GET /api/auditor/documentos
Query: busca, tipo, setor, status, data_inicio, data_fim

GET /api/auditor/documentos/{id}
Response: Documento (metadados + url_visualizacao)

GET /api/auditor/documentos/{id}/historico-acessos
GET /api/auditor/documentos/{id}/versoes
GET /api/auditor/documentos/{id}/compartilhamentos
```

#### 6.3.6 Interface do Auditor

**Menu Lateral:**
```
🔍 Auditor
├── Dashboard
├── Logs
│   ├── Consulta
│   ├── Sessões
│   └── Anomalias
├── Relatórios
│   ├── Acesso
│   ├── Segurança
│   ├── Conformidade
│   └── Agendados
├── Alertas
└── Documentos
```

**Indicadores Visuais:**
- Badge vermelho com número de alertas críticos
- Indicador de anomalias detectadas
- Timeline de atividade em tempo real (opcional)

#### 6.3.7 Regras de Negócio

1. Auditor tem acesso somente leitura a todos os dados
2. Auditor não pode modificar, excluir ou compartilhar documentos
3. Auditor não pode fazer download de documentos (apenas visualizar)
4. Todas as ações do Auditor também são registradas em log
5. Alertas críticos não podem ser resolvidos sem justificativa
6. Relatórios agendados são armazenados por 90 dias
7. Auditor pode visualizar logs de qualquer setor
8. Auditor não tem acesso às configurações do sistema

#### 6.3.8 Endpoints Resumo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/auditor/dashboard | Métricas de conformidade |
| GET | /api/auditor/logs | Consultar logs |
| GET | /api/auditor/logs/{id} | Detalhes do log |
| GET | /api/auditor/sessoes | Histórico de sessões |
| GET | /api/auditor/anomalias | Anomalias detectadas |
| GET | /api/auditor/relatorios/{tipo} | Gerar relatório |
| POST | /api/auditor/relatorios/exportar | Exportar relatório |
| GET | /api/auditor/relatorios/agendados | Listar agendamentos |
| POST | /api/auditor/relatorios/agendar | Criar agendamento |
| DELETE | /api/auditor/relatorios/agendados/{id} | Remover agendamento |
| GET | /api/auditor/alertas | Listar alertas |
| GET | /api/auditor/alertas/{id} | Detalhes do alerta |
| PATCH | /api/auditor/alertas/{id} | Atualizar alerta |
| GET | /api/auditor/alertas/configuracoes | Config. de alertas |
| POST | /api/auditor/alertas/configuracoes | Criar regra de alerta |
| GET | /api/auditor/documentos | Buscar documentos |
| GET | /api/auditor/documentos/{id} | Visualizar documento |
| GET | /api/auditor/documentos/{id}/historico-acessos | Histórico de acessos |

---

### 6.4 Perfil: Usuário Padrão

**Descrição:** Usuário com nível técnico básico que utiliza o sistema diariamente para upload, consulta e edição de documentos. Representa a maioria dos usuários do sistema.

#### 6.4.1 Módulo: Dashboard Pessoal

**Rota:** `/` (raiz) ou `/dashboard`

**Funcionalidades:**

**Visão Geral Pessoal**
- Saudação personalizada ("Bom dia, [Nome]!")
- Métricas pessoais:
  - Meus documentos (total)
  - Compartilhados comigo
  - Pendentes de aprovação (meus)
  - Armazenamento utilizado
- Acesso rápido:
  - Upload de arquivo
  - Nova pasta
  - Digitalizar documento
- Documentos recentes (últimos acessados/editados)
- Atividade recente (timeline pessoal)
- Notificações

#### 6.4.2 Módulo: Meus Arquivos

**Rota:** `/arquivos`

**Funcionalidades:**

**Navegação**
- Árvore de pastas pessoais
- Breadcrumb de navegação
- Visualização em Grid ou Lista
- Ordenação (nome, data, tamanho, tipo)

**Gestão de Pastas**
```
POST /api/pastas
Body: { "nome": string, "pasta_pai_id": number | null }

PUT /api/pastas/{id}
Body: { "nome": string }

DELETE /api/pastas/{id}
Regra: Só pode excluir pastas próprias vazias ou mover conteúdo
```

**Upload de Documentos**
```
POST /api/documentos/upload
Content-Type: multipart/form-data
Body:
  - arquivo: File (obrigatório)
  - pasta_id: number (opcional, default: raiz)
  - tags: number[] (opcional)
  - descricao: string (opcional)

Validações:
  - Tipos permitidos: pdf, docx, xlsx, pptx, jpg, png, zip
  - Tamanho máximo: 50MB por arquivo
  - Limite de armazenamento do usuário

Response: 201 Created { documento: Documento }
```

**Ações em Documentos Próprios**
```
GET /api/documentos/{id}
PUT /api/documentos/{id}
Body: { "nome": string, "descricao": string, "tags": number[] }

DELETE /api/documentos/{id}
Regra: Move para lixeira (soft delete)

POST /api/documentos/{id}/mover
Body: { "pasta_destino_id": number }

POST /api/documentos/{id}/copiar
Body: { "pasta_destino_id": number, "novo_nome": string }

POST /api/documentos/{id}/download
Response: { download_url: string, expira_em: datetime }
```

**Busca**
```
GET /api/documentos/buscar
Query:
  - q: string (busca em nome, conteúdo OCR)
  - tipo: string (pdf, docx, etc.)
  - tags: number[]
  - data_inicio: date
  - data_fim: date
  - pasta_id: number
  - apenas_meus: boolean
```

#### 6.4.3 Módulo: Compartilhados Comigo

**Rota:** `/compartilhados`

**Funcionalidades:**
- Lista de documentos/pastas compartilhados com o usuário
- Filtro por: Quem compartilhou, Permissão, Data
- Indicador de permissão (Leitura/Edição)
- Ações conforme permissão

**API:**
```
GET /api/compartilhados
Query: proprietario_id, permissao, tipo

GET /api/compartilhados/{id}
```

#### 6.4.4 Módulo: Compartilhamento

**Funcionalidades:**

**Compartilhar Documento/Pasta**
```
POST /api/documentos/{id}/compartilhar
Body:
{
  "usuarios": [
    { "email": string, "permissao": "leitura" | "edicao" }
  ],
  "notificar": boolean
}

POST /api/documentos/{id}/link-publico
Body:
{
  "permissao": "leitura" | "download",
  "expiracao": datetime | null,
  "senha": string | null
}
Response: { link: string, token: string }

DELETE /api/documentos/{id}/compartilhar/{usuario_id}
DELETE /api/documentos/{id}/link-publico
```

#### 6.4.5 Módulo: Submissão para Aprovação

**Rota:** `/minhas-aprovacoes`

**Funcionalidades:**

**Submeter Documento**
```
POST /api/documentos/{id}/submeter-aprovacao
Body:
{
  "comentario": string (opcional),
  "urgente": boolean (default: false)
}
Regra: Documento muda status para "em_revisao"
```

**Acompanhar Status**
- Lista de documentos submetidos
- Status: Pendente, Aprovado, Rejeitado, Revisão Solicitada
- Feedback do Gestor
- Histórico de submissões

**API:**
```
GET /api/minhas-aprovacoes
Query: status, data_inicio, data_fim

GET /api/minhas-aprovacoes/{id}
Response: { documento, status, historico_aprovacao[] }
```

#### 6.4.6 Módulo: Visualizador de Documentos

**Rota:** `/visualizar/{id}`

**Funcionalidades:**
- Visualização de PDF em canvas
- Controles de zoom e navegação
- Ferramentas de anotação (se tiver permissão de edição):
  - Marca-texto
  - Comentários
  - Desenho livre
- Download (se permitido)
- Impressão (se permitido)
- Informações do documento

#### 6.4.7 Módulo: Colaboração

**Funcionalidades:**
- Edição colaborativa em tempo real
- Ver cursores de outros usuários
- Chat integrado ao documento
- Indicador de quem está online

#### 6.4.8 Módulo: Lixeira Pessoal

**Rota:** `/lixeira`

**Funcionalidades:**
- Documentos excluídos pelo usuário
- Restaurar documento
- Excluir permanentemente
- Retenção: 30 dias

**API:**
```
GET /api/lixeira

POST /api/lixeira/{id}/restaurar

DELETE /api/lixeira/{id}
Regra: Exclusão permanente, requer confirmação
```

#### 6.4.9 Módulo: Configurações Pessoais

**Rota:** `/configuracoes`

**Funcionalidades:**
- Editar perfil (nome, foto, telefone)
- Alterar senha
- Configurar notificações
- Preferências de visualização (tema, idioma)

**API:**
```
GET /api/perfil
PUT /api/perfil
Body: { nome, telefone, cargo, foto }

PUT /api/perfil/senha
Body: { senha_atual, nova_senha }

GET /api/perfil/notificacoes
PUT /api/perfil/notificacoes
Body: { documentos_compartilhados, aprovacoes, alertas_seguranca }

GET /api/perfil/preferencias
PUT /api/perfil/preferencias
Body: { tema, idioma, visualizacao_padrao }
```

#### 6.4.10 Interface do Usuário Padrão

**Menu Lateral:**
```
🏠 Dashboard
📁 Meus Arquivos
👥 Compartilhados
🕐 Recentes
📋 Minhas Aprovações
🗑️ Lixeira
⚙️ Configurações
```

**Indicadores Visuais:**
- Badge em "Compartilhados" com novos itens
- Badge em "Minhas Aprovações" com status atualizado
- Indicador de armazenamento no rodapé
- Notificações no header

#### 6.4.11 Regras de Negócio

1. Usuário só pode excluir/editar documentos próprios
2. Documentos compartilhados respeitam a permissão definida
3. Upload respeita limite de armazenamento do plano
4. Documentos na lixeira são excluídos após 30 dias
5. Submissão para aprovação é obrigatória em pastas configuradas pelo Gestor
6. Usuário não pode alterar seu próprio perfil de acesso
7. Máximo de 10 uploads simultâneos
8. Documentos com mais de 100MB requerem aprovação especial

#### 6.4.12 Endpoints Resumo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/dashboard | Dashboard pessoal |
| GET | /api/documentos | Listar documentos |
| POST | /api/documentos/upload | Upload de documento |
| GET | /api/documentos/{id} | Obter documento |
| PUT | /api/documentos/{id} | Editar documento |
| DELETE | /api/documentos/{id} | Excluir documento |
| POST | /api/documentos/{id}/mover | Mover documento |
| POST | /api/documentos/{id}/copiar | Copiar documento |
| POST | /api/documentos/{id}/download | Gerar link download |
| GET | /api/documentos/buscar | Buscar documentos |
| GET | /api/pastas | Listar pastas |
| POST | /api/pastas | Criar pasta |
| PUT | /api/pastas/{id} | Editar pasta |
| DELETE | /api/pastas/{id} | Excluir pasta |
| GET | /api/compartilhados | Docs compartilhados comigo |
| POST | /api/documentos/{id}/compartilhar | Compartilhar documento |
| DELETE | /api/documentos/{id}/compartilhar/{uid} | Remover compartilhamento |
| POST | /api/documentos/{id}/link-publico | Gerar link público |
| POST | /api/documentos/{id}/submeter-aprovacao | Submeter para aprovação |
| GET | /api/minhas-aprovacoes | Minhas submissões |
| GET | /api/lixeira | Listar lixeira |
| POST | /api/lixeira/{id}/restaurar | Restaurar documento |
| DELETE | /api/lixeira/{id} | Excluir permanentemente |
| GET | /api/perfil | Obter perfil |
| PUT | /api/perfil | Atualizar perfil |
| PUT | /api/perfil/senha | Alterar senha |
| PUT | /api/perfil/notificacoes | Config. notificações |

---

### 6.5 Perfil: Visitante

**Descrição:** Usuário com nível técnico básico e acesso extremamente limitado. Pode apenas visualizar documentos marcados como públicos, sem capacidade de edição, download ou interação com o sistema.

#### 6.5.1 Módulo: Portal Público

**Rota:** `/publico`

**Funcionalidades:**

**Página Inicial Pública**
- Lista de documentos públicos disponíveis
- Busca simples por nome
- Filtros básicos:
  - Categoria/Setor
  - Tipo de documento
  - Data de publicação
- Ordenação: Mais recentes, Nome A-Z, Mais visualizados

**Visualização de Documento**
- Preview do documento (somente leitura)
- Sem ferramentas de anotação
- Sem download (a menos que explicitamente permitido)
- Sem impressão
- Marca d'água "Documento Público - Somente Visualização"

#### 6.5.2 Módulo: Acesso por Link

**Rota:** `/publico/link/{token}`

**Funcionalidades:**
- Acesso a documento específico via link compartilhado
- Validação de:
  - Token válido
  - Link não expirado
  - Senha (se configurada)
- Visualização conforme permissões do link

**API:**
```
GET /api/publico/link/{token}
Query: senha (se necessário)
Response:
{
  "valido": boolean,
  "requer_senha": boolean,
  "documento": Documento | null,
  "permissoes": {
    "visualizar": boolean,
    "download": boolean
  },
  "expira_em": datetime | null
}
```

#### 6.5.3 Módulo: Catálogo Público

**Rota:** `/publico/catalogo`

**Funcionalidades:**
- Navegação por categorias públicas
- Documentos organizados por:
  - Setor de origem
  - Tipo de documento
  - Tags públicas
- Sem acesso a documentos internos/privados

**API:**
```
GET /api/publico/documentos
Query:
  - busca: string
  - categoria: string
  - tipo: string
  - ordenar: "recentes" | "nome" | "visualizacoes"
  - pagina: number
  - por_pagina: number

GET /api/publico/documentos/{id}
Response: Documento (apenas metadados públicos + url_visualizacao)

GET /api/publico/categorias
Response: { categorias: Categoria[] }
```

#### 6.5.4 Autenticação do Visitante

**Opções de Acesso:**

**1. Acesso Anônimo (sem login)**
- Visualização de documentos 100% públicos
- Sem rastreamento de usuário
- Funcionalidades mínimas

**2. Registro como Visitante**
```
POST /api/auth/registro-visitante
Body:
{
  "nome": string,
  "email": string,
  "empresa": string (opcional),
  "motivo_acesso": string (opcional)
}
Response: { usuario: Usuario, token: string }

Regras:
- Conta criada com perfil "Visitante"
- Requer aprovação de Administrador (opcional, configurável)
- Acesso limitado mesmo após registro
```

**3. Acesso por Convite**
- Administrador ou Gestor envia convite
- Visitante acessa com link único
- Acesso temporário ou permanente

#### 6.5.5 Interface do Visitante

**Layout Simplificado:**
```
┌─────────────────────────────────────────────────┐
│  Logo    [Buscar documentos...]    [Entrar]     │
├─────────────────────────────────────────────────┤
│                                                 │
│  📂 Categorias          📄 Documentos Públicos  │
│  ├── Institucional      ┌──────────────────┐   │
│  ├── Políticas          │ Doc 1            │   │
│  ├── Formulários        │ Publicado em...  │   │
│  └── Manuais            └──────────────────┘   │
│                         ┌──────────────────┐   │
│                         │ Doc 2            │   │
│                         │ Publicado em...  │   │
│                         └──────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Elementos:**
- Header minimalista (logo + busca + login)
- Sidebar com categorias
- Grid de documentos públicos
- Sem menu lateral completo
- Sem notificações
- Sem indicador de armazenamento

#### 6.5.6 Restrições do Visitante

| Funcionalidade | Permitido | Bloqueado |
|----------------|:---------:|:---------:|
| Visualizar docs públicos | ✓ | |
| Buscar docs públicos | ✓ | |
| Download (se permitido no link) | ✓ | |
| Criar documentos | | ✓ |
| Editar documentos | | ✓ |
| Excluir documentos | | ✓ |
| Compartilhar | | ✓ |
| Comentar | | ✓ |
| Colaboração em tempo real | | ✓ |
| Ver docs privados | | ✓ |
| Acessar dashboard | | ✓ |
| Acessar configurações | | ✓ |
| Upload | | ✓ |
| Criar pastas | | ✓ |

#### 6.5.7 Regras de Negócio

1. Visitante só acessa documentos explicitamente marcados como públicos
2. Visitante não pode interagir com outros usuários
3. Acesso anônimo não requer autenticação
4. Links públicos podem ter senha e data de expiração
5. Download só é permitido se configurado no documento/link
6. Visualizações de Visitante são contabilizadas para estatísticas
7. Visitante registrado pode ser promovido a Usuário Padrão pelo Admin
8. Sessão de Visitante expira após 1 hora de inatividade
9. Marca d'água obrigatória em documentos visualizados
10. Rate limiting: máximo 100 visualizações por hora por IP

#### 6.5.8 Endpoints Resumo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/publico/documentos | Listar docs públicos |
| GET | /api/publico/documentos/{id} | Visualizar documento |
| GET | /api/publico/categorias | Listar categorias |
| GET | /api/publico/link/{token} | Acessar por link |
| POST | /api/auth/registro-visitante | Registrar como visitante |

---

### 6.6 APIs dos Novos Módulos

#### 6.6.1 API de Controle de Workflow

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/workflows | Listar workflows |
| POST | /api/workflows | Criar workflow |
| GET | /api/workflows/{id} | Obter workflow |
| PUT | /api/workflows/{id} | Atualizar workflow |
| DELETE | /api/workflows/{id} | Excluir workflow |
| POST | /api/workflows/{id}/ativar | Ativar workflow |
| POST | /api/workflows/{id}/desativar | Desativar workflow |
| POST | /api/workflows/{id}/duplicar | Duplicar workflow |
| GET | /api/workflows/{id}/estatisticas | Estatísticas do workflow |
| GET | /api/workflows/{id}/historico | Histórico de alterações |
| POST | /api/workflows/{id}/etapas | Adicionar etapa |
| PUT | /api/workflows/{id}/etapas/{etapa_id} | Atualizar etapa |
| DELETE | /api/workflows/{id}/etapas/{etapa_id} | Remover etapa |
| POST | /api/workflows/{id}/validar | Validar estrutura do workflow |

#### 6.6.2 API de Tarefas de Workflow

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/tarefas | Listar minhas tarefas |
| GET | /api/tarefas/pendentes | Tarefas pendentes |
| GET | /api/tarefas/concluidas | Tarefas concluídas |
| GET | /api/tarefas/{id} | Detalhes da tarefa |
| POST | /api/tarefas/{id}/aprovar | Aprovar tarefa |
| POST | /api/tarefas/{id}/rejeitar | Rejeitar tarefa |
| POST | /api/tarefas/{id}/delegar | Delegar tarefa |
| POST | /api/tarefas/{id}/solicitar-info | Solicitar informações |
| GET | /api/tarefas/{id}/historico | Histórico da instância |
| GET | /api/tarefas/estatisticas | Estatísticas pessoais |

#### 6.6.3 API de Relatórios de Auditoria

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/auditoria/logs | Consultar logs de auditoria |
| GET | /api/auditoria/logs/{id} | Detalhes do log |
| GET | /api/auditoria/logs/exportar | Exportar logs (CSV) |
| GET | /api/auditoria/alertas | Listar alertas configurados |
| POST | /api/auditoria/alertas | Criar alerta |
| PUT | /api/auditoria/alertas/{id} | Atualizar alerta |
| DELETE | /api/auditoria/alertas/{id} | Remover alerta |
| GET | /api/auditoria/usuarios | Atividade por usuário |
| GET | /api/auditoria/documentos/{id} | Histórico de um documento |

#### 6.6.4 API de Upload de Arquivos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/upload/iniciar | Iniciar upload (retorna upload_id) |
| POST | /api/upload/{upload_id}/chunk | Enviar chunk do arquivo |
| POST | /api/upload/{upload_id}/finalizar | Finalizar upload |
| DELETE | /api/upload/{upload_id}/cancelar | Cancelar upload |
| GET | /api/upload/{upload_id}/status | Status do upload |
| POST | /api/upload/simples | Upload simples (arquivos pequenos) |
| PUT | /api/documentos/{id}/metadados | Atualizar metadados pós-upload |

#### 6.6.5 API de Configurações Avançadas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/configuracoes/compartilhamento | Obter políticas de compartilhamento |
| PUT | /api/configuracoes/compartilhamento | Salvar políticas de compartilhamento |
| GET | /api/configuracoes/marca-agua | Obter config. de marca d'água |
| PUT | /api/configuracoes/marca-agua | Salvar config. de marca d'água |
| GET | /api/configuracoes/seguranca | Obter config. de segurança |
| PUT | /api/configuracoes/seguranca | Salvar config. de segurança |
| POST | /api/configuracoes/restaurar-padroes | Restaurar configurações padrão |

---

## 7. Fluxos Principais

### 7.1 Upload de Documento
1. Usuário clica em "Upload"
2. Seleciona arquivo(s)
3. Sistema valida tipo e tamanho
4. Upload para storage
5. Criação de registro no banco
6. Geração de thumbnail/preview
7. Indexação para busca
8. Notificação de sucesso

### 7.2 Compartilhamento
1. Usuário seleciona documento
2. Abre modal de compartilhamento
3. Adiciona pessoas/grupos
4. Define nível de permissão
5. Opcionalmente gera link público
6. Sistema envia notificações
7. Registra atividade

### 7.3 Colaboração em Tempo Real
1. Usuário abre documento
2. Sistema registra presença
3. WebSocket conecta para sync
4. Alterações são transmitidas em tempo real
5. Cursores de outros usuários são exibidos
6. Chat disponível no painel lateral
7. Auto-save periódico

### 7.4 Fluxo de Workflow de Aprovação
1. Documento é submetido para workflow
2. Sistema cria instância do workflow
3. Primeira tarefa é criada para responsável da etapa inicial
4. Responsável recebe notificação
5. Responsável analisa documento
6. Responsável aprova ou rejeita:
   - Se aprovado: avança para próxima etapa
   - Se rejeitado: retorna para etapa anterior ou encerra
7. Condições são avaliadas automaticamente
8. Processo repete até etapa final
9. Documento é publicado/arquivado conforme configuração
10. Histórico completo é registrado

### 7.5 Upload de Múltiplos Arquivos
1. Usuário abre modal de upload
2. Arrasta arquivos ou seleciona via botão
3. Sistema valida tipos e tamanhos
4. Upload inicia com barra de progresso
5. Ao concluir, formulário de metadados é exibido
6. Usuário preenche pasta destino, tags e descrição
7. Usuário clica em "Finalizar Upload"
8. Documentos são criados no sistema
9. Indexação e geração de thumbnails em background

---

## 8. Considerações Técnicas

### 8.1 Stack Sugerida (baseada no mcp.json)
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** AWS Lambda (Serverless)
- **Banco de Dados:** DynamoDB
- **Storage:** AWS S3
- **Pagamentos:** Stripe
- **Real-time:** WebSockets / AWS AppSync
- **Autenticação:** Cognito ou Auth0

### 8.2 Padrões de Design
- Design System consistente
- Componentes reutilizáveis
- Acessibilidade (WCAG)
- Internacionalização (pt-BR como padrão)

---

## 9. Conclusão

O SGDI é um sistema completo de gestão documental com foco em colaboração, segurança e experiência do usuário. Os templates analisados demonstram uma interface moderna e bem estruturada, cobrindo todos os fluxos essenciais de um sistema de gestão de documentos corporativo.

A implementação deve priorizar:
1. Segurança e controle de acesso
2. Performance e escalabilidade
3. Experiência de colaboração em tempo real
4. Integração com serviços de nuvem
5. Conformidade com regulamentações (LGPD, ISO 27001)
