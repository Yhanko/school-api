const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUpdate() {
  try {
    const user = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
    if (!user) {
      console.log('No teacher found');
      return;
    }
    
    console.log('Updating user', user.id);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        employeeProfile: {
          upsert: {
            create: { phone: '999999999' },
            update: { phone: '999999999' }
          }
        }
      },
      include: { employeeProfile: true }
    });
    console.log('Update successful', updated);
  } catch (e) {
    console.error('Update failed', e);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
