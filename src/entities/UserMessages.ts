import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Channel } from './Channel'
import { User } from './User'

@Entity('users_messages')
export class UserMessages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ default: 0 })
  count = 0

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Channel)
  channel: Channel
}
