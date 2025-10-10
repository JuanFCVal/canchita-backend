import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { GroupMember } from './group-member.entity';

export enum CupStatus {
  ACTIVE = 'active',
  ADVANCED = 'advanced',
  ELIMINATED = 'eliminated',
  FINISHED = 'finished',
}

export enum EliminationRound {
  GROUP_STAGE = 'group_stage',
  QUARTER_FINAL = 'quarter_final',
  SEMI_FINAL = 'semi_final',
  FINAL = 'final',
  CHAMPION = 'champion',
}

@Entity('individual_cups')
export class IndividualCup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_member_id: number;

  @Column({
    type: 'enum',
    enum: CupStatus,
    default: CupStatus.ACTIVE,
  })
  status: CupStatus;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @Column({
    type: 'enum',
    enum: EliminationRound,
    default: EliminationRound.GROUP_STAGE,
  })
  elimination_round: EliminationRound;

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  finished_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToOne(() => GroupMember, (groupMember) => groupMember.individual_cup, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_member_id' })
  group_member: GroupMember;
}
