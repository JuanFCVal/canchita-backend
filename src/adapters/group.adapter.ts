import { Group } from '../entities/group.entity';
import { GroupResponseDto } from '../group/dto/group-response.dto';

/**
 * Maps a Group entity to GroupResponseDto
 * @param group - Group entity from database
 * @returns GroupResponseDto - Formatted response object
 */
export function mapGroupToResponseDTO(group: Group): GroupResponseDto {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    created_at: group.created_at,
    updated_at: group.updated_at,
  };
}
