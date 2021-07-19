import { Column, Entity, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Channel } from './Channel';

@Entity('events')
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  date?: Date;

  @ManyToOne(() => Channel, (channel) => channel.createdEvents, { nullable: false })
  author: Channel;

  @ManyToMany(() => Channel, (channel) => channel.events, { nullable: true })
  @JoinTable()
  participants: Channel[];

  @CreateDateColumn()
  createdAt: Date;
}
