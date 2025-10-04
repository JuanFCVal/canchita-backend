import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: configService.get('NODE_ENV') === 'development',
          ssl: {
            rejectUnauthorized: false,
            ca: undefined,
          },
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
