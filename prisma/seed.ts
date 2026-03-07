import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const EXPENSE_CATEGORIES = [
  { name: "Insumos", description: "Productos y materiales para el negocio", color: "#8B5CF6" },
  { name: "Alquiler", description: "Local, oficina o espacio de trabajo", color: "#EF4444" },
  { name: "Servicios Públicos", description: "Luz, agua, gas, internet, teléfono", color: "#F59E0B" },
  { name: "Transporte", description: "Movilidad, combustible y viáticos", color: "#10B981" },
  { name: "Capacitación", description: "Cursos, talleres y formación", color: "#3B82F6" },
  { name: "Nómina", description: "Salarios, prestaciones y honorarios", color: "#EC4899" },
  { name: "Impuestos", description: "Obligaciones fiscales y tributarias", color: "#6366F1" },
  { name: "Marketing", description: "Publicidad, promoción y redes sociales", color: "#F97316" },
  { name: "Mantenimiento", description: "Reparaciones, mejoras y limpieza", color: "#14B8A6" },
  { name: "Software", description: "Suscripciones, licencias y herramientas digitales", color: "#A3E635" },
  { name: "Seguros", description: "Pólizas y coberturas", color: "#64748B" },
  { name: "Bancarios", description: "Comisiones, intereses y servicios financieros", color: "#78716C" },
  { name: "Suministros", description: "Material de oficina y papelería", color: "#A855F7" },
  { name: "Otros", description: "Gastos varios no categorizados", color: "#6B7280" },
];

async function main() {
  console.log("Seeding categories...");

  for (const category of EXPENSE_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description, color: category.color },
      create: category,
    });
  }

  console.log(`Seeded ${EXPENSE_CATEGORIES.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
