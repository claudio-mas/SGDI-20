# SGDI - Guia de Desenvolvimento Local

Guia completo para configurar o ambiente de desenvolvimento local do Sistema de Gestão de Documentos Inteligente.

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Arquitetura Local](#arquitetura-local)
3. [Serviços e Portas](#serviços-e-portas)
4. [Configuração Passo a Passo](#configuração-passo-a-passo)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Configuração do Keycloak](#configuração-do-keycloak)
7. [Configuração do MinIO](#configuração-do-minio)
8. [Comandos Úteis](#comandos-úteis)
9. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

### Software Necessário

| Software | Versão Mínima | Download |
|----------|---------------|----------|
| Docker | 24.0+ | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Docker Compose | 2.20+ | Incluído no Docker Desktop |
| Git | 2.40+ | [git-scm.com](https://git-scm.com/) |
| Node.js (opcional) | 20.0+ | [nodejs.org](https://nodejs.org/) |

### Recursos de Sistema Recomendados

- **RAM:** Mínimo 8GB (recomendado 16GB)
- **CPU:** 4 cores
- **Disco:** 10GB livres
- **Portas disponíveis:** 3000, 5432, 6379, 8000, 8080, 9000, 9001

### Verificar Instalação

```bash
# Verificar Docker
docker --version
docker compose version

# Verificar portas em uso (Windows PowerShell)
netstat -ano | findstr "3000 5432 6379 8000 8080 9000 9001"

# Verificar portas em uso (Linux/Mac)
lsof -i :3000,:5432,:6379,:8000,:8080,:9000,:9001
```

---

## Arquitetura Local

```
┌─────────────────────────────────────────────────────────────────┐
│                    Ambiente de Desenvolvimento                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│  :3000       │     │  :8000       │     │  :5432       │
│  (React)     │     │  (Fastify)   │     │              │
└──────────────┘     └──────┬───────┘     └──────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  Redis   │      │  MinIO   │      │ Keycloak │
   │  :6379   │      │  :9000   │      │  :8080   │
   │          │      │  :9001   │      │          │
   └──────────┘      └──────────┘      └──────────┘
```

---

## Serviços e Portas

| Serviço | Porta | URL de Acesso | Credenciais Padrão |
|---------|-------|---------------|-------------------|
| Frontend | 3000 | http://localhost:3000 | - |
| Backend API | 8000 | http://localhost:8000 | - |
| PostgreSQL | 5432 | localhost:5432 | `sgdi` / `sgdi_dev` |
| Redis | 6379 | localhost:6379 | - |
| Keycloak | 8080 | http://localhost:8080 | `admin` / `admin` |
| MinIO API | 9000 | http://localhost:9000 | `minioadmin` / `minioadmin` |
| MinIO Console | 9001 | http://localhost:9001 | `minioadmin` / `minioadmin` |

---

## Configuração Passo a Passo

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd sgdi
```

### 2. Criar Arquivo de Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env
```

### 3. Configurar .env para Desenvolvimento Local

Edite o arquivo `.env` com as seguintes configurações:

```env
# ============================================
# SGDI - Variáveis de Ambiente (Desenvolvimento)
# ============================================

# --------------------------------------------
# AMBIENTE
# --------------------------------------------
NODE_ENV=development

# --------------------------------------------
# BANCO DE DADOS
# --------------------------------------------
DATABASE_URL=postgresql://sgdi:sgdi_dev@postgres:5432/sgdi_db

# --------------------------------------------
# MINIO (Storage)
# --------------------------------------------
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# --------------------------------------------
# KEYCLOAK (Autenticação)
# --------------------------------------------
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_CLIENT_SECRET=dev-client-secret

# --------------------------------------------
# JWT
# --------------------------------------------
JWT_SECRET=dev-jwt-secret-change-in-production-32chars

# --------------------------------------------
# CORS
# --------------------------------------------
CORS_ORIGIN=http://localhost:3000
```

### 4. Subir os Serviços

```bash
# Subir todos os containers em background
docker compose up -d

# Acompanhar logs (opcional)
docker compose logs -f
```

### 5. Aguardar Inicialização

Os serviços levam alguns segundos para inicializar completamente. Verifique o status:

```bash
# Ver status dos containers
docker compose ps

# Verificar se o backend está pronto
docker compose logs backend --tail=20
```

### 6. Executar Migrations do Banco

```bash
# Sincronizar schema do Prisma com o banco
docker compose exec backend npm run db:push

# Gerar client do Prisma
docker compose exec backend npm run db:generate

# Popular dados iniciais (seed)
docker compose exec backend npm run db:seed
```

### 7. Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:8000/documentation
- **Keycloak Admin:** http://localhost:8080 (admin/admin)
- **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin)

---

## Variáveis de Ambiente

### Variáveis do Backend

| Variável | Descrição | Valor Dev | Obrigatório |
|----------|-----------|-----------|-------------|
| `NODE_ENV` | Ambiente de execução | `development` | Sim |
| `PORT` | Porta do servidor | `8000` | Sim |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://sgdi:sgdi_dev@postgres:5432/sgdi_db` | Sim |
| `REDIS_URL` | Connection string Redis | `redis://redis:6379` | Sim |
| `MINIO_ENDPOINT` | Host do MinIO | `minio` | Sim |
| `MINIO_PORT` | Porta do MinIO | `9000` | Sim |
| `MINIO_ACCESS_KEY` | Access key MinIO | `minioadmin` | Sim |
| `MINIO_SECRET_KEY` | Secret key MinIO | `minioadmin` | Sim |
| `MINIO_BUCKET` | Nome do bucket | `sgdi-documentos` | Sim |
| `KEYCLOAK_URL` | URL do Keycloak | `http://keycloak:8080` | Sim |
| `KEYCLOAK_REALM` | Realm do Keycloak | `sgdi` | Sim |
| `KEYCLOAK_CLIENT_ID` | Client ID backend | `sgdi-backend` | Sim |
| `KEYCLOAK_CLIENT_SECRET` | Client secret | `your-client-secret` | Sim |
| `JWT_SECRET` | Chave para JWT | `dev-jwt-secret...` | Sim |

### Variáveis do Frontend

| Variável | Descrição | Valor Dev |
|----------|-----------|-----------|
| `VITE_API_URL` | URL da API | `http://localhost:8000` |
| `VITE_WS_URL` | URL WebSocket | `ws://localhost:8000` |
| `VITE_KEYCLOAK_URL` | URL do Keycloak | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Realm | `sgdi` |
| `VITE_KEYCLOAK_CLIENT_ID` | Client ID frontend | `sgdi-frontend` |

---

## Configuração do Keycloak

O Keycloak é usado para autenticação SSO. Após subir os containers, configure-o:

### 1. Acessar Console Admin

1. Acesse http://localhost:8080
2. Clique em "Administration Console"
3. Login: `admin` / `admin`

### 2. Criar Realm

1. Hover no dropdown "master" (canto superior esquerdo)
2. Clique em "Create Realm"
3. Nome: `sgdi`
4. Clique em "Create"

### 3. Criar Client para Frontend

1. No menu lateral: Clients → Create client
2. **General Settings:**
   - Client ID: `sgdi-frontend`
   - Client type: `OpenID Connect`
3. **Capability config:**
   - Client authentication: `OFF`
   - Authorization: `OFF`
   - Standard flow: `ON`
   - Direct access grants: `ON`
4. **Login settings:**
   - Root URL: `http://localhost:3000`
   - Home URL: `http://localhost:3000`
   - Valid redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`

### 4. Criar Client para Backend

1. Clients → Create client
2. **General Settings:**
   - Client ID: `sgdi-backend`
   - Client type: `OpenID Connect`
3. **Capability config:**
   - Client authentication: `ON`
   - Authorization: `OFF`
   - Service accounts roles: `ON`
4. **Credentials tab:**
   - Copie o Client secret e atualize no `.env`

### 5. Criar Usuário de Teste

1. Users → Add user
2. **User details:**
   - Username: `usuario.teste`
   - Email: `teste@sgdi.local`
   - First name: `Usuário`
   - Last name: `Teste`
   - Email verified: `ON`
3. Clique em "Create"
4. **Credentials tab:**
   - Set password: `teste123`
   - Temporary: `OFF`

---

## Configuração do MinIO

O MinIO é usado para armazenamento de arquivos (compatível com S3).

### 1. Acessar Console

1. Acesse http://localhost:9001
2. Login: `minioadmin` / `minioadmin`

### 2. Criar Bucket

1. No menu lateral: Buckets → Create Bucket
2. Bucket Name: `sgdi-documentos`
3. Clique em "Create Bucket"

### 3. Configurar Política de Acesso (Opcional)

Para desenvolvimento, o bucket pode ser privado (padrão). O backend acessa via credenciais.

---

## Comandos Úteis

### Docker Compose

```bash
# Subir todos os serviços
docker compose up -d

# Parar todos os serviços
docker compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker compose down -v

# Ver logs de todos os serviços
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend

# Reiniciar um serviço
docker compose restart backend

# Rebuild de um serviço
docker compose up -d --build backend

# Executar comando em um container
docker compose exec backend npm run db:push
```

### Prisma (Banco de Dados)

```bash
# Sincronizar schema com banco
docker compose exec backend npm run db:push

# Criar migration
docker compose exec backend npm run db:migrate

# Gerar Prisma Client
docker compose exec backend npm run db:generate

# Executar seed
docker compose exec backend npm run db:seed

# Abrir Prisma Studio (GUI do banco)
docker compose exec backend npx prisma studio
```

### Desenvolvimento

```bash
# Acessar shell do container backend
docker compose exec backend sh

# Acessar shell do container frontend
docker compose exec frontend sh

# Instalar nova dependência no backend
docker compose exec backend npm install <pacote>

# Rodar testes
docker compose exec backend npm test
```

### PostgreSQL

```bash
# Acessar psql
docker compose exec postgres psql -U sgdi -d sgdi_db

# Backup do banco
docker compose exec postgres pg_dump -U sgdi sgdi_db > backup.sql

# Restaurar backup
docker compose exec -T postgres psql -U sgdi sgdi_db < backup.sql
```

### Redis

```bash
# Acessar redis-cli
docker compose exec redis redis-cli

# Limpar cache
docker compose exec redis redis-cli FLUSHALL
```

---

## Troubleshooting

### Problema: Porta já em uso

```bash
# Windows PowerShell - encontrar processo usando a porta
netstat -ano | findstr ":8000"
# Matar processo pelo PID
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Problema: Container não inicia

```bash
# Ver logs detalhados
docker compose logs <serviço>

# Verificar se imagem foi construída
docker compose build <serviço>

# Remover containers órfãos
docker compose down --remove-orphans
```

### Problema: Erro de conexão com banco

1. Verifique se o PostgreSQL está rodando:
   ```bash
   docker compose ps postgres
   ```
2. Verifique a `DATABASE_URL` no `.env`
3. Aguarde o PostgreSQL inicializar completamente (pode levar 30s)

### Problema: Keycloak não conecta ao banco

O Keycloak usa o mesmo PostgreSQL. Verifique:
1. Se o PostgreSQL está saudável
2. Se as credenciais estão corretas no `docker-compose.yml`

### Problema: Frontend não conecta ao Backend

1. Verifique se o backend está rodando: `docker compose ps backend`
2. Verifique CORS no backend
3. Confirme que `VITE_API_URL` está correto

### Problema: Erro de permissão no MinIO

1. Verifique se o bucket existe
2. Confirme credenciais no `.env`
3. Verifique logs: `docker compose logs minio`

### Limpar Tudo e Recomeçar

```bash
# Parar tudo e remover volumes
docker compose down -v

# Remover imagens do projeto
docker rmi $(docker images 'sgdi*' -q)

# Reconstruir do zero
docker compose up -d --build
```

---

## Próximos Passos

Após configurar o ambiente:

1. Configure o Keycloak conforme seção acima
2. Crie o bucket no MinIO
3. Execute as migrations e seed
4. Acesse http://localhost:3000 e faça login

Para dúvidas, consulte a documentação principal em `README.md` ou a especificação em `ESPECIFICACAO_SOFTWARE_SGDI.md`.
