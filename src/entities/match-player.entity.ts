import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { GroupMember } from './group-member.entity';

export enum Team {
  TEAM_A = 'team_a',
  TEAM_B = 'team_b',
}

@Entity('match_players')
export class MatchPlayer {
  @PrimaryColumn()
  match_id: number;

  @PrimaryColumn()
  member_id: number;

  @Column({
    type: 'enum',
    enum: Team,
  })
  team: Team;

  @Column({ default: false })
  is_captain: boolean;

  @CreateDateColumn()
  joined_match_at: Date;

  @ManyToOne(() => Match, (match) => match.match_players, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(
    () => GroupMember,
    (groupMember) => groupMember.match_participations,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'member_id' })
  group_member: GroupMember;
}
