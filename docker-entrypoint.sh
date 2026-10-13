#!/bin/sh
set -e

# Garante que o diretório de uploads existe
mkdir -p /app/uploads

# Executa migrações do Prisma por padrão (a menos que explicitamente desativado com 'false')
if [ "$PRISMA_RUN_MIGRATIONS" != "false" ]; then
  echo "🚀 [school-api] Sincronizando banco de dados com Prisma..."
  if npx prisma migrate deploy; then
    echo "✅ [school-api] 'prisma migrate deploy' concluído com sucesso."
  else
    echo "⚠️ [school-api] 'prisma migrate deploy' encontrou pendências. Executando 'prisma db push' de contingência..."
    npx prisma db push
  fi
elif [ "$PRISMA_RUN_DB_PUSH" = "true" ]; then
  echo "🚀 [school-api] Executando 'prisma db push'..."
  npx prisma db push
fi

echo "🟢 [school-api] Inicializando aplicação..."
exec "$@"
