const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { role: 'TEACHER' }, include: { employeeProfile: true } });
  if (!user) return console.log('No teacher found');
  
  console.log('Before:', user.employeeProfile);
  
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      employeeProfile: {
        upsert: {
          create: { photoUrl: 'http://test.com/photo.jpg' },
          update: { photoUrl: 'http://test.com/photo.jpg' }
        }
      }
    },
    include: { employeeProfile: true }
  });
  
  console.log('After:', updated.employeeProfile);
}

main().catch(console.error).finally(() => prisma.$disconnect());
