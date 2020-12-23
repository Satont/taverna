import { Injectable } from '@nestjs/common'
import { TeamWithUsers, HelixStream, HelixUser } from 'twitch'
import { getRepository } from 'typeorm'
import { Channel } from '../../entities/Channel'
import { Raid } from '../../entities/Raid'
import { UserMessages } from '../../entities/UserMessages'
import twitch from '../../twitch'

@Injectable()
export class TeamService {
  private readonly channelRepository = getRepository(Channel)
  private readonly userMessagesRepository = getRepository(UserMessages)
  private readonly raidsRepository = getRepository(Raid)

  async getMeta() {
    const team = await twitch.bot?.api.kraken.teams.getTeamByName(process.env.TWITCH_TEAMNAME)
    const totalMessages = (await this.userMessagesRepository.createQueryBuilder('row').select('SUM(row.count)', 'count').getRawOne())?.count ?? 0
    const totalRaids = await this.raidsRepository.count()

    const stats = {
      messages: totalMessages,
      raids: totalRaids,
    }

    return {
      ...(team as any)._data as TeamWithUsers,
      stats,
    }
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

  async getUser(id: string) {
    const [user, channel] = await Promise.all([
      twitch.bot?.api.helix.users.getUserById(id),
      this.channelRepository.findOne(id),
    ])
    const [
      totalMessages = { count: 0 },
      top10MessengersDB,
    ] = await Promise.all([
      this.userMessagesRepository
        .createQueryBuilder('row')
        .select('SUM(row.count)', 'count')
        .where({ channel: channel.id })
        .getRawOne(),

      this.userMessagesRepository.find({
        where: { channel },
        take: 10,
        order: { count: 'DESC' },
        relations: ['user'],
      }),
    ])

    const top10Messengers = (await twitch.bot?.api.helix.users.getUsersByIds(top10MessengersDB.map(u => u.user.id)))
      ?.map(user => ({
        ...(user as any)._data,
        messages: top10MessengersDB.find(u => u.user.id === user.id).count,
      }))

    return {
      user: (user as any)?._data,
      channel: {
        ...channel,
        messages: {
          total: totalMessages.count,
          top10: top10Messengers,
        },
        raids: {
          total: {
            incoming: 0,
            outcoming: 0,
          },
          top10: {
            incoming: {},
            outComing: {},
          },
        },
      },
    }
  }
}
