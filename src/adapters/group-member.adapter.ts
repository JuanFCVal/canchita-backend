import { GroupMember } from '../entities/group-member.entity';
import { GroupMemberResponseDto } from '../group-member/dto/group-member-response.dto';

export function mapGroupMemberToResponseDTO(
  groupMember: GroupMember,
): GroupMemberResponseDto {
  return {
    id: groupMember.id,
    name: groupMember.name,
    email: groupMember.email,
    user_profile_id: groupMember.user_profile_id,
    is_placeholder: groupMember.is_placeholder,
    joined_at: groupMember.joined_at,
    updated_at: groupMember.updated_at,
  };
}
