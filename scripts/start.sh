#!/bin/sh
set -e

echo "🚀 Iniciando Cuenti App..."
echo "⏳ Esperando a que la base de datos esté lista..."

# Esperar a que PostgreSQL esté disponible
until nc -z -v -w30 postgres 5432 2>/dev/null || nc -z -v -w30 $(echo $DATABASE_URL | sed -n 's/.*@\(.*\):.*/\1/p') 5432 2>/dev/null
do
  echo "⏳ Esperando PostgreSQL..."
  sleep 2
done

echo "✅ PostgreSQL está listo"

# Ejecutar migraciones de Prisma
echo "📦 Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

echo "✅ Migraciones completadas"

# Iniciar la aplicación
echo "🎯 Iniciando servidor Next.js..."
exec node server.js
