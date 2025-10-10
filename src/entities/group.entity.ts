import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { GroupMember } from './group-member.entity';
import { Match } from './match.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  owner_profile_id: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.owned_groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_profile_id' })
  owner_profile: UserProfile;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group)
  members: GroupMember[];

  @OneToMany(() => Match, (match) => match.group)
  matches: Match[];
}
