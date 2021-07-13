import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column } from 'typeorm';
import { Channel } from './Channel';

@Entity('raids')
export class Raid extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Channel)
  from: Channel;

  @ManyToOne(() => Channel)
  to: Channel;

  @Column({ nullable: true })
  viewers: number;
}
