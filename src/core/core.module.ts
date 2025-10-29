import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './database/seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    SeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
  ],
  exports: [DatabaseModule, SeedModule, JwtModule],
})
export class CoreModule {}
