import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';

async function run() {
  const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
  const metadata: ArgumentMetadata = { type: 'body', metatype: Object, data: '' };
  
  try {
    const result = await pipe.transform({ employeeProfile: { photoUrl: 'url' } }, metadata);
    console.log('Result:', result);
  } catch (e) {
    console.log('Error:', e.message);
  }
}
run();
