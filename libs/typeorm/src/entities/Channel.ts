import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany, ManyToMany } from 'typeorm';
import { Event } from './Event';
import { Raid } from './Raid';
import { UserMessages } from './UserMessages';

@Entity('channels')
export class Channel extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column({ default: false })
  online!: boolean;

  @OneToMany(() => Raid, (raid) => raid.to)
  raided: Raid[];

  @OneToMany(() => Raid, (raid) => raid.from)
  raids: Raid[];

  @OneToMany(() => UserMessages, (messages) => messages.channel)
  messages: UserMessages[];

  @OneToMany(() => Event, (event) => event.author)
  createdEvents: Event[];

  @ManyToMany(() => Event, (event) => event.participants)
  events: Event[];
}
