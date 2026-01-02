# SGDI - Sistema de Gestão de Documentos Inteligente

Sistema completo de gestão documental com colaboração em tempo real, workflows de aprovação e auditoria.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenResty (Proxy)                        │
└─────────────────────────────────────────────────────────────┘
         │              │              │            │
         ▼              ▼              ▼            ▼
┌──────────────┐ ┌────────────┐ ┌───────────┐ ┌───────────┐
│   Frontend   │ │  Backend   │ │  Keycloak │ │   MinIO   │
│   (React)    │ │  (Fastify) │ │  (Auth)   │ │   (S3)    │
└──────────────┘ └─────┬──────┘ └───────────┘ └───────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │PostgreSQL│  │  Redis   │  │  MinIO   │
   │  (DB)    │  │ (Cache)  │  │ (Files)  │
   └──────────┘  └──────────┘  └──────────┘
```

## Requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local sem Docker)
- PostgreSQL existente na VPS (produção)
- OpenResty existente na VPS (produção)

## Desenvolvimento Local

```bash
# Clonar e entrar no diretório
cd sgdi

# Copiar variáveis de ambiente
cp .env.example .env

# Subir todos os serviços
docker-compose up -d

# Executar migrations do banco
docker-compose exec backend npm run db:push
docker-compose exec backend npm run db:seed

# Acessar
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Keycloak: http://localhost:8080 (admin/admin)
# MinIO:    http://localhost:9001 (minioadmin/minioadmin)
```

## Deploy em Produção (VPS)

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Editar .env com valores de produção
```

### 2. Configurar rede Docker

```bash
# Criar rede compartilhada (se não existir)
docker network create vps-network

# Conectar PostgreSQL existente à rede
docker network connect vps-network seu-container-postgres
```

### 3. Adicionar configuração ao OpenResty

```bash
# Copiar configuração
cp openresty/sgdi.conf /caminho/do/seu/openresty/conf.d/

# Recarregar OpenResty
docker exec openresty nginx -s reload
```

### 4. Build e deploy

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Subir serviços
docker-compose -f docker-compose.prod.yml up -d

# Migrations
docker-compose -f docker-compose.prod.yml exec backend npm run db:push
```

### 5. Copiar arquivos do frontend para OpenResty

```bash
# Copiar build do frontend para volume do OpenResty
docker cp sgdi-frontend:/app/dist /var/www/sgdi/
```

## Estrutura do Projeto

```
sgdi/
├── backend/                 # API Node.js + Fastify
│   ├── src/
│   │   ├── config/         # Configurações (DB, Redis, MinIO)
│   │   ├── routes/         # Rotas da API
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco
│   └── Dockerfile
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Contextos (Auth)
│   │   ├── pages/          # Páginas
│   │   └── services/       # API client
│   └── Dockerfile
├── database/
│   └── init/               # Scripts SQL iniciais
├── openresty/
│   └── sgdi.conf           # Configuração do proxy
├── docker-compose.yml      # Desenvolvimento
├── docker-compose.prod.yml # Produção
└── .env.example
```

## Integração com Templates

Os templates HTML em `../templates/` devem ser convertidos para componentes React:

1. Copiar estrutura HTML para componentes `.tsx`
2. Converter classes Tailwind (já compatíveis)
3. Substituir dados estáticos por props/state
4. Conectar com API via React Query

## Tecnologias

- **Frontend:** React 18, TypeScript, Tailwind CSS, React Query
- **Backend:** Node.js, Fastify, Prisma ORM
- **Banco:** PostgreSQL
- **Auth:** Keycloak (SSO)
- **Storage:** MinIO (S3-compatible)
- **Cache:** Redis
- **Proxy:** OpenResty

## Licença

Proprietário - Todos os direitos reservados
