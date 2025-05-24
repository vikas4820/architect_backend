import { Body, Controller, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService
  ) {}

  @Post()
  async createInitialDatabase(@Body('secretKey') secretKey: string) {
    if (secretKey !== process.env.SECRECT_DB_KEY) {
      throw new HttpException('Forbidden: Invalid secret key', HttpStatus.FORBIDDEN);
    }

    return await this.settingsService.initDatabase();
  }
}
