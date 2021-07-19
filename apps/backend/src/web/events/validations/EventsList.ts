import { Type } from 'class-transformer';
import { Max, Min } from 'class-validator';

export class EventsList {
  @Min(1)
  @Type(() => Number)
  page: number;

  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number;
}
