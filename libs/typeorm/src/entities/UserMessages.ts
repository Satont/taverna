import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Channel } from './Channel';
import { User } from './User';

@Entity('users_messages')
export class UserMessages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Column({ default: 0 })
  count: number = 0;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Channel)
  channel: Channel;
}
