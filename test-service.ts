import { PrismaClient } from '@prisma/client';
import { AcademicYearsService } from './src/academic-years/academic-years.service';
const prisma = new PrismaClient();
const service = new AcademicYearsService({ ...prisma } as any);
async function main() {
  const activeYear = await service.getActiveYear('02ee86c0-12c5-4b51-b690-6223313e6fe5');
  console.log(activeYear);
}
main().finally(() => prisma.$disconnect());
