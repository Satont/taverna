import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate, IsArray } from 'class-validator';
import { Event } from '@taverna/typeorm';

export class CreateEvent implements Partial<Event> {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsArray()
  participants?: [];
}
