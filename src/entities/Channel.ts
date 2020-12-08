import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany } from 'typeorm'
import { Raid } from './Raid'

@Entity('channels')
export class Channel extends BaseEntity {
  @PrimaryColumn()
  id!: string

  @Column()
  username!: string

  @OneToMany(() => Raid, raid => raid.to)
  todayRaided: Raid[]
}
