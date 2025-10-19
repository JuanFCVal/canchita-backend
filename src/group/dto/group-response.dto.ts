import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({
    description: 'Group ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Group name',
    example: 'My Weekend Soccer Group',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Group description',
    example: 'A group for weekend soccer matches',
  })
  description?: string;

  @ApiProperty({
    description: 'Group creation date',
    example: '2025-10-18T21:00:00.000Z',
  })
  created_at: Date;

  @ApiPropertyOptional({
    description: 'Group last update date',
    example: '2025-10-19T10:00:00.000Z',
  })
  updated_at?: Date;
}
