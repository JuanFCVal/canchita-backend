import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupResponseDto } from './dto/group-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Groups')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Request() req: any,
  ): Promise<GroupResponseDto> {
    const userProfileId = req.user.profile.id;
    return this.groupService.create(createGroupDto, userProfileId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active groups of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of user groups',
    type: [GroupResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req: any): Promise<GroupResponseDto[]> {
    const userProfileId = req.user.profile.id;
    return this.groupService.findAllByOwner(userProfileId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific group by ID' })
  @ApiParam({ name: 'id', description: 'Group ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Group details',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<GroupResponseDto> {
    if (!id) {
      throw new BadRequestException('Group ID is required');
    }

    const userProfileId = req.user.profile.id;
    return this.groupService.findOne(id, userProfileId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a group (owner only)' })
  @ApiParam({ name: 'id', description: 'Group ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Group updated successfully',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Request() req: any,
  ): Promise<GroupResponseDto> {
    const userProfileId = req.user.profile.id;
    return this.groupService.update(id, updateGroupDto, userProfileId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a group (owner only)' })
  @ApiParam({ name: 'id', description: 'Group ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Group deactivated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Group successfully deactivated' },
        group_id: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ message: string; group_id: string }> {
    const userProfileId = req.user.profile.id;
    return this.groupService.remove(id, userProfileId);
  }
}
