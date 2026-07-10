const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { id: "3688f710-4320-4601-8a8e-bc613bd941e3" }});
  console.log(JSON.stringify(user, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
