import { Injectable } from '@nestjs/common'
import { TeamWithUsers, HelixStream, HelixUser } from 'twitch'
import twitch from '../../twitch'

@Injectable()
export class TeamService {
  async getMeta() {
    const team = await twitch.bot?.api.kraken.teams.getTeamByName(process.env.TWITCH_TEAMNAME)

    return (team as any)._data as TeamWithUsers
  }

  async getTeamUsers(): Promise<Array<HelixUser & { stream: HelixStream }>> {
    const team = await twitch.bot?.api.kraken.teams.getTeamByName(process.env.TWITCH_TEAMNAME)
    const users = await twitch.bot?.api.helix.users.getUsersByIds((team as any)._data.users.map(u => u._id) as string[])
    const streams = await twitch?.bot.api.helix.streams.getStreams({ userId: users.map(u => u.id) })

    return users.map(u => ({
      ...(u as any)._data,
      stream: ((streams.data.find(s => s.userId === u.id) as any))?._data ?? null,
    }))
  }
}
