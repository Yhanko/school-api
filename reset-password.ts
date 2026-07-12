import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'melissaagnaldo@gmail.com';
  // Use any to bypass strict type checking if schema is slightly different, though we expect 'user'
  const user = await (prisma as any).user.findFirst({ where: { email } });
  
  if (!user) {
    console.log(`User ${email} not found.`);
    return;
  }
  
  console.log(`User found: ${user.name} (ID: ${user.id})`);
  
  const newPassword = 'password123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await (prisma as any).user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });
  
  console.log(`Password reset successfully to: ${newPassword}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
