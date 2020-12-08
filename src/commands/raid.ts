import { createBotCommand } from 'easy-twitch-bot'
import { getRepository } from 'typeorm'
import { Channel } from '../entities/Channel'
import dayjs from 'dayjs'
import twitch from '../twitch'
import { sampleSize } from 'lodash'

export default createBotCommand('raid', async (params, context) => {
  const online = await twitch.bot.api.helix.streams.getStreamsPaginated({
    userId: twitch.channels.map(c => c.id),
  }).getAll()

  const channels: Array<{ id: string, username: string, raided: string }> = await getRepository(Channel)
    .createQueryBuilder('channel')
    .leftJoin(
      'raids',
      'raids',
      '"raids"."toId" = "channel"."id" and ("raids"."createdAt" > :startOfDay AND "raids"."createdAt" < :endOfDay)',
      {
        startOfDay: dayjs().startOf('day'),
        endOfDay: dayjs().endOf('day')
      }
    )
    .addSelect('channel.id', 'id')
    .addSelect('channel.username', 'username')
    .addSelect('raids.count', 'raided')
    .where('channel.id IN (:...channelsIds)', { channelsIds: online.map(c => c.userId) })
    .groupBy('channel.id')
    .orderBy('raids.count', 'ASC')
    .execute()


  const suggestions = sampleSize(channels, 3)

  const result: string[] = []

  for (const suggestion of suggestions) {
    const stream = online.find(c => c.userId === suggestion.id)
    const message = `${suggestion.username}(${(await stream.getGame()).name}) 👁️ ${stream.viewers} 📢 ${suggestion.raided}`
    result.push(message)
  }

  context.say(`Предлагаю зарейдить: ${result.join(' или ')}.`)
})
