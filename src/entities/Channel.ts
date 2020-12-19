import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany } from 'typeorm'
import { Raid } from './Raid'
import { UserMessages } from './UserMessages'

@Entity('channels')
export class Channel extends BaseEntity {
  @PrimaryColumn()
  id!: string

  @Column()
  username!: string

  @Column({ default: false })
  online!: boolean

  @OneToMany(() => Raid, raid => raid.to)
  raided: Raid[]

  @OneToMany(() => Raid, raid => raid.from)
  raids: Raid[]

  @OneToMany(() => UserMessages, messages => messages.channel)
  messages: UserMessages[]
}
