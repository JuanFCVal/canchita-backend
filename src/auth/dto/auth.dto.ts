import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Nombre del usuario (opcional)',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class SignInDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Token de renovación',
    example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
  })
  @IsString()
  refresh_token: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token de renovación',
    example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Información del usuario',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      name: 'Juan Pérez',
    },
  })
  user: {
    id: string;
    email: string;
    name?: string;
  };
}
