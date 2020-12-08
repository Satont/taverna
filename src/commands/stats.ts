import dayjs from 'dayjs'
import { createBotCommand } from 'easy-twitch-bot'
import { getRepository } from 'typeorm'
import { Channel } from '../entities/Channel'
import twitch from '../twitch'

export default createBotCommand('stats', async (params, context) => {
  if (!twitch.channels.some(c => c.id === context.msg.userInfo.userId)) return
  const channel = await getRepository(Channel)
    .findOne(context.msg.channelId, {
      relations: ['raided', 'raids']
    })
  const todayRaided = channel.raided.filter(raid => {
    const date = dayjs(raid.createdAt)
    return date > dayjs().startOf('day') && date < dayjs().endOf('day')
  })
  const todayRaids = channel.raids.filter(raid => {
    const date = dayjs(raid.createdAt)
    return date > dayjs().startOf('day') && date < dayjs().endOf('day')
  })

  const raidedString = `Этот канал рейдили ${channel.raided.length} раз${todayRaided.length ? `, из них сегодня: ${todayRaided.length}` : '.'}`
  const raidsString = `Рейдов от @${context.channel.replace('#', '')} было ${channel.raids.length}${todayRaids.length ? `, из них сегодня: ${todayRaids.length}` : '.'}`
  context.say(`${raidedString} ${raidsString}`)
})
