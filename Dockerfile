# ==============================================================================
# Dockerfile Otimizado e Seguro para Produção - school-api (NestJS + Prisma)
# ==============================================================================
# Boas Práticas Implementadas:
# - Multi-Stage Build (redução drástica do tamanho da imagem final)
# - Segurança: Execução com usuário sem privilégios (non-root 'node')
# - Robustez: dumb-init como PID 1 para tratamento de sinais UNIX (SIGTERM/SIGINT)
# - Performance: Cache otimizado de camadas do Docker (package.json + lockfile)
# - Resiliência: Healthcheck nativo em Node.js (zero dependências externas como curl)
# - Configuração via Ambiente: 100% aderente aos 12 fatores (Twelve-Factor App)
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Base Image: Runtime Node.js oficial com Debian Slim (estabilidade com glibc/Prisma/bcrypt)
# ------------------------------------------------------------------------------
FROM node:20-bookworm-slim AS base

# Dependências essenciais do SO:
# - openssl: Requisito fundamental para o Prisma Query Engine
# - ca-certificates: Para chamadas HTTPS seguras a APIs externas (Cloudinary, Brevo, Twilio, etc.)
# - dumb-init: Gerenciador de processos leve para PID 1 e graceful shutdown
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    dumb-init \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ------------------------------------------------------------------------------
# 2. Dependencies Stage: Instalação limpa e em cache das dependências
# ------------------------------------------------------------------------------
FROM base AS dependencies

# Copia manifestos de pacotes e schema do Prisma (necessário para o script de postinstall)
COPY package.json package-lock.json ./
COPY prisma/schema.prisma ./prisma/

# Instala todas as dependências de forma reprodutível (npm ci executa o postinstall)
RUN npm ci

# ------------------------------------------------------------------------------
# 3. Builder Stage: Compilação do código TypeScript e geração do Prisma Client
# ------------------------------------------------------------------------------
FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig*.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

# Compila a aplicação NestJS (o script 'build' já inclui 'prisma generate')
RUN npm run build

# Remove as dependências de desenvolvimento para manter apenas as de produção
RUN npm prune --omit=dev

# ------------------------------------------------------------------------------
# 4. Production Runner Stage: Imagem final mínima e segura
# ------------------------------------------------------------------------------
FROM base AS runner

LABEL maintainer="YhankoEduca Team" \
      description="school-api production container"

# Variáveis padrão de ambiente para produção
ENV NODE_ENV=production \
    PORT=4000 \
    PRISMA_RUN_MIGRATIONS=true \
    PRISMA_RUN_DB_PUSH=false

WORKDIR /app

# Garante a existência do diretório de uploads com permissão estrita para o usuário 'node'
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Copia artefatos estritamente necessários do builder (código mantido read-only para segurança)
COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./

# Garante terminação de linha LF e permissões de execução no entrypoint
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && \
    chmod +x /app/docker-entrypoint.sh

# Muda para o usuário sem privilégios 'node' (UID 1000)
USER node

# Expõe a porta configurável (padrão 4000)
EXPOSE 4000

# Healthcheck nativo em Node.js (sem depender de curl ou ferramentas externas)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 4000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# dumb-init gerencia sinais Unix e repassa para o entrypoint
ENTRYPOINT ["dumb-init", "--", "/app/docker-entrypoint.sh"]

# Inicialização padrão da API compilada
CMD ["node", "dist/main.js"]
