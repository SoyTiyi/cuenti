# 🚀 Guía de Despliegue - Cuenti App

Esta guía explica cómo desplegar Cuenti App en producción usando Dokploy.

## 📋 Requisitos Previos

- VPS con Dokploy instalado
- Dominio configurado con SSL
- Cuenta en Auth0
- (Opcional) Servicio de base de datos PostgreSQL

## 🏗️ Arquitectura de Despliegue

```
┌──────────────────────────────────────────────┐
│                   VPS                        │
│  ┌────────────┐  ┌──────────┐  ┌─────────┐  │
│  │  Next.js   │  │ Postgres │  │  MinIO  │  │
│  │   :3000    │  │  :5432   │  │  :9000  │  │
│  └────────────┘  └──────────┘  └─────────┘  │
│         │                                   │
│  ┌──────┴──────┐                           │
│  │    Nginx    │  (SSL/TLS + Proxy)         │
│  │   (Dokploy) │                           │
│  └─────────────┘                           │
└──────────────────────────────────────────────┘
```

## 🚀 Paso a Paso - Despliegue en Dokploy

### 1. Preparar el Repositorio

Asegúrate de tener todos estos archivos en tu repo:
```
.
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── next.config.ts
├── .env.production.template
├── scripts/
│   ├── start.sh
│   └── migrate.sh
└── src/app/api/health/route.ts
```

### 2. Configurar Auth0 para Producción

1. Ve a [Auth0 Dashboard](https://manage.auth0.com/)
2. Crea una nueva aplicación (Regular Web Application)
3. Configura las URLs:
   - **Allowed Callback URLs**: `https://tu-dominio.com/api/auth/callback`
   - **Allowed Logout URLs**: `https://tu-dominio.com`
   - **Allowed Web Origins**: `https://tu-dominio.com`
4. Guarda el **Domain**, **Client ID** y **Client Secret**

### 3. Desplegar en Dokploy

#### Opción A: Usando Dockerfile (Recomendado)

1. En Dokploy, crea un nuevo servicio tipo **Application**
2. Conecta tu repositorio de GitHub/GitLab
3. Selecciona el **Dockerfile** como método de build
4. Configura las variables de entorno (ver `.env.production.template`)
5. Configura el dominio y SSL
6. Deploy!

#### Opción B: Usando docker-compose.yml

1. En Dokploy, crea un nuevo servicio tipo **Docker Compose**
2. Sube o conecta tu `docker-compose.yml`
3. Configura las variables de entorno
4. Deploy!

### 4. Configurar Base de Datos

#### Opción 1: PostgreSQL en Dokploy (Recomendado)

1. Crea un nuevo servicio de **PostgreSQL** en Dokploy
2. Guarda las credenciales
3. Actualiza `DATABASE_URL`:
   ```
   postgresql://user:password@postgres:5432/cuenti_db
   ```

#### Opción 2: PostgreSQL Externo

Si usas un servicio externo (Railway, Supabase, etc.):
```
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### 5. Configurar MinIO (Storage)

#### Opción 1: MinIO en Dokploy

1. Crea un servicio **MinIO** en Dokploy
2. Configura las credenciales
3. Crea el bucket `profile-pictures`

#### Opción 2: AWS S3

Usa las variables `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`

### 6. Variables de Entorno Requeridas

Copia `.env.production.template` a `.env.local` y completa:

```bash
# Base de datos
DATABASE_URL=postgresql://...

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_SECRET=random_string_32_chars
AUTH0_BASE_URL=https://your-domain.com
APP_BASE_URL=https://your-domain.com

# Storage
MINIO_ENDPOINT=https://minio.your-domain.com
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
PROFILE_BUCKET=profile-pictures
```

## 🔧 Comandos Útiles

### Ejecutar migraciones manualmente

```bash
# Entra al contenedor
docker exec -it cuenti-app sh

# Ejecuta migraciones
npx prisma migrate deploy
```

### Ver logs

```bash
# Logs de la app
docker logs -f cuenti-app

# Logs de la base de datos
docker logs -f cuenti-postgres
```

### Backup de base de datos

```bash
docker exec cuenti-postgres pg_dump -U cuenti cuenti_db > backup.sql
```

### Restore de base de datos

```bash
cat backup.sql | docker exec -i cuenti-postgres psql -U cuenti -d cuenti_db
```

## 🏥 Health Checks

La aplicación expone un endpoint de health check en:
```
GET /api/health
```

Respuesta exitosa:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected",
    "app": "running"
  }
}
```

## 🔒 Seguridad

- ✅ La aplicación corre con usuario no-root (nextjs:1001)
- ✅ Headers de seguridad habilitados
- ✅ Variables de entorno no expuestas en el build
- ✅ Conexiones HTTPS forzadas
- ✅ Health checks configurados

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
# Ejecuta en el contenedor
docker exec -it cuenti-app sh
npx prisma generate
```

### Error: "Database connection failed"

Verifica que:
1. PostgreSQL está corriendo
2. DATABASE_URL es correcta
3. La base de datos existe

### Error: "Auth0 callback error"

Verifica en Auth0:
1. Allowed Callback URLs incluye `/api/auth/callback`
2. AUTH0_BASE_URL coincide con tu dominio

### Imágenes no cargan

Verifica:
1. MINIO_ENDPOINT es accesible desde el navegador
2. El bucket `profile-pictures` existe
3. Las políticas de CORS están configuradas

## 📊 Monitoreo

Recomendado instalar:
- **Uptime Kuma**: Monitoreo de disponibilidad
- **Dokploy**: Ya incluye métricas básicas

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to Dokploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Dokploy
        run: |
          curl -X POST "${{ secrets.DOKPLOY_WEBHOOK_URL }}"
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs: `docker logs cuenti-app`
2. Verifica health check: `curl https://tu-dominio.com/api/health`
3. Revisa variables de entorno

---

**¡Listo para producción!** 🚀
