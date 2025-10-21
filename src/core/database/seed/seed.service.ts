import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import  bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  async seedAll() {
    this.seedUsers();
  }

  async seedUsers() {
    this.logger.log('Users seeders started');

    const first_name = this.configService.get('SUPERADMIN_FIRSTNAME');
    const last_name = this.configService.get('SUPERADMIN_LASTNAME');
    const email = this.configService.get('SUPERADMIN_EMAIL');
    const username = this.configService.get('SUPERADMIN_USERNAME');
    const password = this.configService.get('SUPERADMIN_PASSWORD');

    const findExistsAdmin = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!findExistsAdmin) {
      const hashedPassword = await bcrypt.hash(password, 12);

      await this.prisma.user.create({
        data: {
          first_name,
          last_name,
          username,
          email,
          password: hashedPassword,
          role: Role.SUPERADMIN,
        },
      });
      this.logger.log('Users seeders ended');
    } else {
      this.logger.warn('SUPERADMIN is already exists');
    }
  }

  async onModuleInit() {
    try {
      await this.seedAll();
      this.logger.log('Seeder ishladi');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
