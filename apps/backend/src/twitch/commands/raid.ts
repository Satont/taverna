import { BotCommand, BotCommandContext } from 'easy-twitch-bot';
import { getRepository } from 'typeorm';
import { Channel } from '@taverna/typeorm';
import dayjs from 'dayjs';
import twitch from '../index';
import { take } from 'lodash';

class Command extends BotCommand {
  name = 'raid';

  async execute(params: string[], context: BotCommandContext) {
    if (!twitch.channels.some((c) => c.id === context.msg.userInfo.userId)) return;

    const online = (
      await twitch.bot.api.helix.streams
        .getStreamsPaginated({
          userId: twitch.channels.map((c) => c.id),
        })
        .getAll()
    ).filter((c) => c.userId !== context.msg.channelId);

    const channels: Array<{ id: string; username: string; raided: string }> = await getRepository(Channel)
      .createQueryBuilder('channel')
      .leftJoin(
        'raids',
        'raids',
        '"raids"."toId" = "channel"."id" and ("raids"."createdAt" > :startOfDay AND "raids"."createdAt" < :endOfDay)',
        {
          startOfDay: dayjs().startOf('day').toDate(),
          endOfDay: dayjs().endOf('day').toDate(),
        },
      )
      .addSelect('channel.id', 'id')
      .addSelect('channel.username', 'username')
      .addSelect('raids.count', 'raided')
      .where('channel.id IN (:...channelsIds)', { channelsIds: online.map((c) => c.userId) })
      .groupBy('channel.id')
      .orderBy('raids.count', 'ASC')
      .execute();

    const result: string[] = [];

    const suggestions = online.filter((s) => channels.some((c) => c.id === s.userId)).sort((a, b) => Number(a.viewers) - Number(b.viewers));

    for (const suggestion of suggestions) {
      const channel = channels.find((c) => c.id === suggestion.userId);
      const message = `${channel.username} 🎮 ${(await suggestion.getGame()).name} 👁️ ${suggestion.viewers} 📢 ${channel.raided}`;
      result.push(message);
    }

    context.say(`Предлагаю зарейдить: ${take(result, 5).join(' или ')}.`);
  }
}

export default new Command();
