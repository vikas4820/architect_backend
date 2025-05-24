import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/components/users/users.entity';
import { Role } from 'src/components/users/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Users,
    ]
    )
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
