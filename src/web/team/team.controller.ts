import { Controller, Get, Param } from '@nestjs/common'
import { TeamService } from './team.service'

@Controller('api/team')
export class TeamController {
  constructor(
    private readonly service: TeamService
  ) {}

  @Get()
  meta() {
    return this.service.getMeta()
  }

  @Get('users')
  users() {
    return this.service.getTeamUsers()
  }

  @Get('users/:id')
  user(@Param('id') id: string) {
    return this.service.getUser(id)
  }
}
