import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './database/seed/seed.module';

Module({
  imports: [DatabaseModule, SeedModule],
  exports: [DatabaseModule],
});
export class CoreModule {}
