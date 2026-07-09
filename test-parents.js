const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({where: {role: 'PARENT'}, include: {employeeProfile: true}});
  console.log(users.map(u => ({id: u.id, name: u.name, phone: u.employeeProfile?.phone})));
}
main().finally(() => prisma.$disconnect());
