import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMemberService } from './group-member.service';
import { GroupMemberController } from './group-member.controller';
import { GroupMember } from '../entities/group-member.entity';
import { Group } from '../entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember, Group])],
  controllers: [GroupMemberController],
  providers: [GroupMemberService],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
