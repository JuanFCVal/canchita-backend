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
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { MatchPlayer } from './match-player.entity';

export enum WinnerTeam {
  TEAM_A = 'team_a',
  TEAM_B = 'team_b',
  DRAW = 'draw',
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id: number;

  @Column()
  created_by_member_id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: 0 })
  team_a_score: number;

  @Column({ default: 0 })
  team_b_score: number;

  @Column({
    type: 'enum',
    enum: WinnerTeam,
    nullable: true,
  })
  winner_team: WinnerTeam;

  @Column({ default: false })
  is_finished: boolean;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Group, (group) => group.matches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => GroupMember, (groupMember) => groupMember.created_matches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by_member_id' })
  created_by_member: GroupMember;

  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.match)
  match_players: MatchPlayer[];
}
