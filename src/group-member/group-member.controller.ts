import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GroupMemberService } from './group-member.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { GroupMemberResponseDto } from './dto/group-member-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Group Members')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('group/:groupId/members')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new member to the group' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Member added successfully',
    type: GroupMemberResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a group member' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async addMember(
    @Param('groupId') groupId: string,
    @Body() createGroupMemberDto: CreateGroupMemberDto,
    @Request() req: any,
  ): Promise<GroupMemberResponseDto> {
    const userProfileId = req.user.profile.id;
    return this.groupMemberService.addMember(
      groupId,
      createGroupMemberDto,
      userProfileId,
    );
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remove a member from the group (soft delete)' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' })
  @ApiParam({ name: 'memberId', description: 'Member ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Member removed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Group member successfully removed',
        },
        member_id: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a group member' })
  @ApiResponse({ status: 404, description: 'Group or member not found' })
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @Request() req: any,
  ): Promise<{ message: string; member_id: string }> {
    const userProfileId = req.user.profile.id;
    return this.groupMemberService.removeMember(
      groupId,
      memberId,
      userProfileId,
    );
  }

  @Get(':memberId')
  @ApiOperation({ summary: 'Enable a member from the group' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' })
  @ApiParam({ name: 'memberId', description: 'Member ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Member enabled successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Group member successfully enabled',
        },
        member_id: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a group member' })
  @ApiResponse({ status: 404, description: 'Group or member not found' })
  async enableMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @Request() req: any,
  ): Promise<{ message: string; member_id: string }> {
    const userProfileId = req.user.profile.id;
    return this.groupMemberService.enableMember(
      groupId,
      memberId,
      userProfileId,
    );
  }

  @Patch(':memberId')
  @ApiOperation({ summary: 'Update member information' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' })
  @ApiParam({ name: 'memberId', description: 'Member ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Member updated successfully',
    type: GroupMemberResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a group member' })
  @ApiResponse({ status: 404, description: 'Group or member not found' })
  async updateMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
    @Request() req: any,
  ): Promise<GroupMemberResponseDto> {
    const userProfileId = req.user.profile.id;
    return this.groupMemberService.updateMember(
      groupId,
      memberId,
      updateGroupMemberDto,
      userProfileId,
    );
  }
}
