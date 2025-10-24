import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupMemberDto {
  @ApiProperty({
    description: 'Name of the group member',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Email address of the group member (optional)',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
