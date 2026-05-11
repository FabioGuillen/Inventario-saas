import prisma from "../src/config/prisma.js";

const roles = ["owner", "admin", "employee"] as const;

async function main(): Promise<void> {
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  console.log("Seed ejecutado correctamente");
}

main()
  .catch((error: unknown) => {
    console.error("Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
