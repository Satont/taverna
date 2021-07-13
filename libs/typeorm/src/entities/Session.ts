import { ISession } from 'connect-typeorm';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('sessions')
export class Session implements ISession {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column('bigint')
  expiredAt = Date.now();

  @Column('text')
  json: any;
}
