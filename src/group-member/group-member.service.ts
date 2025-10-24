import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from '../entities/group-member.entity';
import { Group } from '../entities/group.entity';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { GroupMemberResponseDto } from './dto/group-member-response.dto';
import { mapGroupMemberToResponseDTO } from '../adapters/group-member.adapter';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  private async validateGroupAccess(
    groupId: string,
    userProfileId: string,
  ): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
        is_active: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isOwner = group.owner_profile_id === userProfileId;
    const isMember = await this.groupMemberRepository.findOne({
      where: {
        group_id: groupId,
        user_profile_id: userProfileId,
        is_active: true,
      },
    });

    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        'Access denied. You are not a member of this group.',
      );
    }
  }

  private async findGroupMemberByIdAndGroup(
    memberId: string,
    groupId: string,
    isActive = true,
  ): Promise<GroupMember> {
    const member = await this.groupMemberRepository.findOne({
      where: {
        id: memberId,
        group_id: groupId,
        is_active: isActive,
      },
    });

    if (!member) {
      throw new NotFoundException('Group member not found');
    }

    return member;
  }

  async addMember(
    groupId: string,
    createGroupMemberDto: CreateGroupMemberDto,
    userProfileId: string,
  ): Promise<GroupMemberResponseDto> {
    await this.validateGroupAccess(groupId, userProfileId);

    const groupMember = this.groupMemberRepository.create({
      name: createGroupMemberDto.name,
      email: createGroupMemberDto.email,
      group_id: groupId,
      is_placeholder: true,
      is_active: true,
    });

    const savedMember = await this.groupMemberRepository.save(groupMember);
    return mapGroupMemberToResponseDTO(savedMember);
  }

  async removeMember(
    groupId: string,
    memberId: string,
    userProfileId: string,
  ): Promise<{ message: string; member_id: string }> {
    await this.validateGroupAccess(groupId, userProfileId);

    const member = await this.findGroupMemberByIdAndGroup(memberId, groupId);

    member.is_active = false;
    await this.groupMemberRepository.save(member);

    return {
      message: 'Group member successfully removed',
      member_id: memberId,
    };
  }

  async enableMember(
    groupId: string,
    memberId: string,
    userProfileId: string,
  ): Promise<{ message: string; member_id: string }> {
    await this.validateGroupAccess(groupId, userProfileId);

    const member = await this.findGroupMemberByIdAndGroup(
      memberId,
      groupId,
      false,
    );

    member.is_active = true;
    await this.groupMemberRepository.save(member);

    return {
      message: 'Group member successfully enabled',
      member_id: memberId,
    };
  }

  async updateMember(
    groupId: string,
    memberId: string,
    updateGroupMemberDto: UpdateGroupMemberDto,
    userProfileId: string,
  ): Promise<GroupMemberResponseDto> {
    await this.validateGroupAccess(groupId, userProfileId);

    const member = await this.findGroupMemberByIdAndGroup(memberId, groupId);

    if (updateGroupMemberDto.name) {
      member.name = updateGroupMemberDto.name;
    }

    if (updateGroupMemberDto.email !== undefined) {
      member.email = updateGroupMemberDto.email;
    }

    if (updateGroupMemberDto.user_profile_id) {
      member.user_profile_id = updateGroupMemberDto.user_profile_id;
      member.is_placeholder = false;
    }

    const updatedMember = await this.groupMemberRepository.save(member);
    return mapGroupMemberToResponseDTO(updatedMember);
  }
}
