import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './components/users/users.module';
import { SettingsModule } from './utilities/settings/settings.module';
import { AuthModule } from './components/auth/auth.module';
import databaseConfig from './utilities/database.config';
import { RolesGuard } from './components/guard/roles/roles.guard';
import { JwtAuthGuard } from './components/auth/jwt-auth.guard';
import { ProductModule } from './components/product/product.module';
import { ProductCategoryModule } from './components/product-category/product-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get('database');
        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    UsersModule,
    SettingsModule,
    AuthModule,
    ProductModule,
    ProductCategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RolesGuard,
    JwtAuthGuard,
  ],
})
export class AppModule {}
