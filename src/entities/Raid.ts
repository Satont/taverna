import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm'
import { Channel } from './Channel'

@Entity('raids')
export class Raid extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne(() => Channel)
  from: Channel

  @ManyToOne(() => Channel)
  to: Channel
}
