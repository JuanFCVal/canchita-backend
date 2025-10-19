import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupResponseDto } from './dto/group-response.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(
    createGroupDto: CreateGroupDto,
    userProfileId: string,
  ): Promise<GroupResponseDto> {
    const group = this.groupRepository.create({
      name: createGroupDto.name,
      description: createGroupDto.description,
      owner_profile_id: userProfileId,
    });

    const savedGroup = await this.groupRepository.save(group);
    return this.mapToResponseDto(savedGroup);
  }

  async findAllByOwner(userProfileId: string): Promise<GroupResponseDto[]> {
    const groups = await this.groupRepository.find({
      where: {
        owner_profile_id: userProfileId,
        is_active: true,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return groups.map((group) => this.mapToResponseDto(group));
  }

  async findOne(id: string, userProfileId: string): Promise<GroupResponseDto> {
    const group = await this.groupRepository.findOne({
      where: {
        id,
        owner_profile_id: userProfileId,
        is_active: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.mapToResponseDto(group);
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
    userProfileId: string,
  ): Promise<GroupResponseDto> {
    const group = await this.groupRepository.findOne({
      where: {
        id,
        owner_profile_id: userProfileId,
        is_active: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    Object.assign(group, updateGroupDto);

    const updatedGroup = await this.groupRepository.save(group);
    return this.mapToResponseDto(updatedGroup);
  }

  async remove(
    id: string,
    userProfileId: string,
  ): Promise<{ message: string; group_id: string }> {
    const group = await this.groupRepository.findOne({
      where: {
        id,
        owner_profile_id: userProfileId,
        is_active: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }
    group.is_active = false;
    await this.groupRepository.save(group);

    return {
      message: 'Group successfully deactivated',
      group_id: id,
    };
  }

  private mapToResponseDto(group: Group): GroupResponseDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.created_at,
      updated_at: group.updated_at,
    };
  }
}
