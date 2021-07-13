import { BotCommand, BotCommandContext } from 'easy-twitch-bot';
import { getRepository } from 'typeorm';
import { User } from '@taverna/typeorm';

class Command extends BotCommand {
  name = 'me';
  private readonly repository = getRepository(User);

  async execute(params: string[], context: BotCommandContext) {
    const user = await this.repository.findOne(context.msg.userInfo.userId, { relations: ['messages', 'messages.channel'] });
    if (!user) return;

    const thisChannel = user.messages.find((instance) => instance.channel.id === context.msg.channelId);
    const totalMessages = user.messages.reduce((previous, current) => previous + current.count, 0);

    context.say(
      `@${context.msg.userInfo.displayName} сообщений на этом канале: ${thisChannel.count}, всего сообщений в сообществе: ${totalMessages}`,
    );
  }
}

export default new Command();
