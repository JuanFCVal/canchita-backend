import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiPropertyOptional({
    description: 'Group name',
    example: 'Updated Group Name',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({
    description: 'Group description',
    example: 'New description for the group',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
