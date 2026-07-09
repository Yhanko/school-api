const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const institutions = await prisma.institution.findMany();
  for (const inst of institutions) {
    const existing = await prisma.academicYear.findFirst({
      where: { institutionId: inst.id }
    });
    if (!existing) {
      console.log(`Creating default Academic Year for institution ${inst.id}`);
      await prisma.academicYear.create({
        data: {
          year: '2025/2026',
          startDate: new Date('2025-09-01'),
          endDate: new Date('2026-06-30'),
          isActive: true,
          institutionId: inst.id
        }
      });
    } else if (!existing.isActive) {
      console.log(`Activating existing Academic Year for institution ${inst.id}`);
      await prisma.academicYear.update({
        where: { id: existing.id },
        data: { isActive: true }
      });
    }
  }
  console.log('Done!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
