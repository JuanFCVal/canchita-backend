import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupMemberResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the group member',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the group member',
    example: 'John Doe',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Email address of the group member',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'User profile ID if linked to a registered user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_profile_id?: string;

  @ApiProperty({
    description:
      'Whether this member is a placeholder (not linked to registered user)',
    example: true,
  })
  is_placeholder: boolean;

  @ApiProperty({
    description: 'Date when the member joined the group',
    example: '2023-12-01T10:00:00.000Z',
  })
  joined_at: Date;

  @ApiProperty({
    description: 'Date when the member was last updated',
    example: '2023-12-01T10:00:00.000Z',
  })
  updated_at: Date;
}
