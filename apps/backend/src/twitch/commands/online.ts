import { BotCommand, BotCommandContext } from 'easy-twitch-bot';
import twitch from '../index';

class Command extends BotCommand {
  name = 'online';

  async execute(params: string[], context: BotCommandContext) {
    if (!twitch.channels.some((c) => c.id === context.msg.userInfo.userId)) return;

    const channels = (
      await twitch.bot.api.kraken.streams.getStreams(twitch.channels.map((c) => c.id).filter((id) => id !== context.msg.channelId))
    ).sort((a, b) => a.viewers - b.viewers);

    const channelsArray = channels.map((c) => `${c.channel.name} 🎮 ${c.game} 👁️ ${c.viewers}`);
    context.say(`${channelsArray.join(', ')}`);
  }
}

export default new Command();
