import { createBotCommand } from 'easy-twitch-bot'
import twitch from '../twitch'

export default createBotCommand('online', async (params, context) => {
  if (!twitch.channels.some(c => c.id === context.msg.userInfo.userId)) return

  const channels = (await twitch.bot.api.kraken.streams
    .getStreams(twitch.channels.map(c => c.id)))
    .sort((a, b) => a.viewers - b.viewers)

  const channelsArray = channels.map(c => `${c.channel.name} 🎮 ${c.game} 👁️ ${c.viewers}`)
  context.say(`${channelsArray.join(', ')}`)
})
