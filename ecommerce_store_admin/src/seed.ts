import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DataSource } from 'typeorm';
import { seedDatabase } from './database/seed';
import { AuthService } from './modules/auth/auth.service';

async function runSeed() {
  console.log('🌱 Starting database seeding...');

  // Create NestJS application context (NO HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    const authService = app.get(AuthService);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    await seedDatabase(dataSource, authService);

    console.log('✅ Seeding finished successfully');
  } catch (error) {
    console.error('❌ Seeding failed', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

runSeed();
