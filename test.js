const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const resources = await prisma.resource.findMany();
  console.log(JSON.stringify(resources.slice(-10), null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
