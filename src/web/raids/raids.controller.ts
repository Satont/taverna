import { Controller, Get } from '@nestjs/common'
import { RaidsService } from './raids.service'

@Controller('api/raids')
export class RaidsController {
  constructor(
    private readonly service: RaidsService
  ) {}

  @Get()
  getRaids() {
    return this.service.getRaids()
  }
}
