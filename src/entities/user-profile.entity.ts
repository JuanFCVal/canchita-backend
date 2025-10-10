import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';

@Entity('user_profiles')
@Unique(['email'])
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ nullable: true })
  reset_password_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => Group, (group) => group.owner_profile)
  owned_groups: Group[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user_profile)
  group_memberships: GroupMember[];
}
