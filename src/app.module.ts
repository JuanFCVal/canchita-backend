import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { GroupMemberModule } from './group-member/group-member.module';
import { SupabaseModule } from './supabase/supabase.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import {
  UserProfile,
  Group,
  GroupMember,
  IndividualCup,
  Match,
  MatchPlayer,
} from './entities';

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
          entities: [
            UserProfile,
            Group,
            GroupMember,
            IndividualCup,
            Match,
            MatchPlayer,
          ],
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
    SupabaseModule,
    AuthModule,
    GroupModule,
    GroupMemberModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
