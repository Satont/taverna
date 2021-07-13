import { Entity, BaseEntity, PrimaryColumn, OneToMany } from 'typeorm';
import { UserMessages } from './UserMessages';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @OneToMany(() => UserMessages, (messages) => messages.user, { cascade: true })
  messages: UserMessages[];
}
