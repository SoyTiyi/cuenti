#!/bin/sh
set -e

echo "📦 Ejecutando migraciones de Prisma..."

# Verificar que DATABASE_URL esté configurada
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL no está configurada"
  exit 1
fi

# Ejecutar migraciones
echo "🔄 Aplicando migraciones pendientes..."
npx prisma migrate deploy

echo "✅ Migraciones completadas exitosamente"
