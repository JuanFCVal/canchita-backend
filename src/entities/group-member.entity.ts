import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { Group } from './group.entity';
import { IndividualCup } from './individual-cup.entity';
import { Match } from './match.entity';
import { MatchPlayer } from './match-player.entity';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'uuid', nullable: true })
  user_profile_id: string;

  @Column({ type: 'uuid' })
  group_id: string;

  @Column({ default: true })
  is_placeholder: boolean;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  joined_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  @ManyToOne(
    () => UserProfile,
    (userProfile) => userProfile.group_memberships,
    {
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'user_profile_id' })
  user_profile: UserProfile;

  @ManyToOne(() => Group, (group) => group.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToOne(() => IndividualCup, (individualCup) => individualCup.group_member)
  individual_cup: IndividualCup;

  @OneToMany(() => Match, (match) => match.created_by_member)
  created_matches: Match[];

  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.group_member)
  match_participations: MatchPlayer[];
}
