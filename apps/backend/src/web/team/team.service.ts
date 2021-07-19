import { Injectable } from '@nestjs/common';
import { TeamWithUsers, HelixStream, HelixUserData } from 'twitch';
import { getRepository } from 'typeorm';
import { Channel, Raid, UserMessages } from '@taverna/typeorm';
import twitch from '../../twitch';

@Injectable()
export class TeamService {
  private readonly channelRepository = getRepository(Channel);
  private readonly userMessagesRepository = getRepository(UserMessages);
  private readonly raidsRepository = getRepository(Raid);

  async getMeta() {
    const team = await twitch.api.kraken.teams.getTeamByName(process.env.TWITCH_TEAMNAME);
    const totalMessages =
      (await this.userMessagesRepository.createQueryBuilder('row').select('SUM(row.count)', 'count').getRawOne())?.count ?? 0;
    const totalRaids = await this.raidsRepository.count();

    const stats = {
      messages: totalMessages,
      raids: totalRaids,
    };

    return {
      ...((team as any)._data as TeamWithUsers),
      stats,
    };
  }

  async getTeamUsers(): Promise<Array<HelixUserData & { stream: HelixStream }>> {
    const team = await twitch.api.kraken.teams.getTeamByName(process.env.TWITCH_TEAMNAME);
    const users = await twitch.api.helix.users.getUsersByIds((team as any)._data.users.map((u) => u._id) as string[]);
    const streams = await twitch?.api.helix.streams.getStreams({ userId: users.map((u) => u.id) });

    return users.map((u) => ({
      ...(u as any)._data,
      stream: (streams.data.find((s) => s.userId === u.id) as any)?._data ?? null,
    }));
  }

  async getUser(id: string) {
    const [user, channel, latestRaidsTo, latestRaidsFrom] = await Promise.all([
      twitch.api.helix.users.getUserById(id),
      this.channelRepository.findOne(id),
      this.raidsRepository.find({
        where: { to: { id } },
        take: 100,
        order: { createdAt: 'DESC' },
        relations: ['from'],
      }),
      this.raidsRepository.find({
        where: { from: { id } },
        take: 100,
        order: { createdAt: 'DESC' },
        relations: ['from', 'to'],
      }),
    ]);
    const [totalMessages = { count: 0 }, top10MessengersDB] = await Promise.all([
      this.userMessagesRepository.createQueryBuilder('row').select('SUM(row.count)', 'count').where({ channel: channel.id }).getRawOne(),

      this.userMessagesRepository.find({
        where: { channel },
        take: 10,
        order: { count: 'DESC' },
        relations: ['user'],
      }),
    ]);

    const top10Messengers = (await twitch.bot?.api.helix.users.getUsersByIds(top10MessengersDB.map((u) => u.user.id)))
      ?.map((user) => ({
        ...(user as any)._data,
        messages: top10MessengersDB.find((u) => u.user.id === user.id).count,
      }))
      .sort((a, b) => a.messages - b.messages);

    const neededTwitchUsers = await twitch.api.helix.users.getUsersByIds(
      [...latestRaidsTo.map((raid) => raid.from.id), ...latestRaidsFrom.map((raid) => raid.from.id)].filter(
        (value, index, array) => array.indexOf(value) === index,
      ),
    );

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
            incoming: await this.raidsRepository.count({ to: { id } }),
            outcoming: await this.raidsRepository.count({ from: { id } }),
          },
          top10: {
            incoming: {},
            outComing: {},
          },
          latestTo: latestRaidsTo.map((raid) => {
            const channel = neededTwitchUsers.find((user) => user.id === raid.from.id);
            return {
              ...raid,
              channel: {
                login: channel?.name,
                profile_image_url: channel?.profilePictureUrl,
                userId: channel?.id,
              },
            };
          }),
          latestFrom: latestRaidsFrom.map((raid) => {
            const channel = neededTwitchUsers.find((user) => user.id === raid.to.id);
            return {
              ...raid,
              channel: {
                login: channel?.name,
                profile_image_url: channel?.profilePictureUrl,
                userId: channel?.id,
              },
            };
          }),
        },
      },
    };
  }
}
