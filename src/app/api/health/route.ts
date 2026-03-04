import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Verificar conexión a base de datos
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        app: 'running'
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return Response.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        app: 'running'
      },
      error: 'Database connection failed'
    }, { status: 503 });
  }
}
