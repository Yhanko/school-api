const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { parent: true, enrollments: true }
  });
  console.log(users.map(u => ({ id: u.id, name: u.name, parent: u.parent?.name, enrollments: u.enrollments.length })));
}

main().finally(() => prisma.$disconnect());
