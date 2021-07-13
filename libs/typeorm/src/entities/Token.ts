import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export enum TokenType {
  BOT = 'bot',
  USER = 'user',
}

@Entity('tokens')
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  accessToken!: string;

  @Column()
  refreshToken!: string;

  @Column({ enum: TokenType })
  type: TokenType;
}
