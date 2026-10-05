#!/bin/sh
set -e

# Garante que o diretório de uploads existe
mkdir -p /app/uploads

# Executa migrações do Prisma se configurado via variável de ambiente
if [ "$PRISMA_RUN_MIGRATIONS" = "true" ]; then
  echo "🚀 [school-api] Executando 'prisma migrate deploy'..."
  npx prisma migrate deploy
fi

if [ "$PRISMA_RUN_DB_PUSH" = "true" ]; then
  echo "🚀 [school-api] Executando 'prisma db push'..."
  npx prisma db push
fi

echo "🟢 [school-api] Inicializando aplicação..."
exec "$@"
