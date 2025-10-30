import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateGroupMemberDto } from './create-group-member.dto';

export class UpdateGroupMemberDto extends PartialType(CreateGroupMemberDto) {
  @ApiPropertyOptional({
    description: 'User profile ID to link this member to a registered user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  user_profile_id?: string;
}
