import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      useFactory: (configService: ConfigService): SupabaseClient => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseServiceKey = configService.get<string>(
          'SUPABASE_SERVICE_ROLE_KEY',
        );

        if (!supabaseUrl || !supabaseServiceKey) {
          throw new Error('Supabase URL and Service Role Key are required');
        }

        return createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}
