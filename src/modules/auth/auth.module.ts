import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
