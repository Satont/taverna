import { Controller, Get, Param } from '@nestjs/common';
import { TeamService } from './team.service';
import { HelixUserData, HelixStream } from 'twitch';

@Controller('team')
export class TeamController {
  constructor(private readonly service: TeamService) {}

  @Get()
  meta() {
    return this.service.getMeta();
  }

  @Get('users')
  users(): Promise<Array<HelixUserData & { stream: HelixStream }>> {
    return this.service.getTeamUsers();
  }

  @Get('users/:id')
  user(@Param('id') id: string) {
    return this.service.getUser(id);
  }
}
