import { PrivateMessage } from 'twitch-chat-client';
import { getRepository } from 'typeorm';
import twitch from '..';
import { User, UserMessages } from '@taverna/typeorm';

const userRepository = getRepository(User);
const userMessagesRepository = getRepository(UserMessages);

export const onMessage = async (_channel: string, _use: string, _message: string, msg: PrivateMessage) => {
  const channel = twitch.channels.find((c) => c.id === msg.channelId);

  if (!channel || !channel?.online) return;

  let user = await userRepository.findOne(msg.userInfo.userId, { relations: ['messages', 'messages.channel'] });
  if (!user) {
    user = userRepository.create({ id: msg.userInfo.userId });
    user.messages = [];
  }

  let currentChannel = user.messages.find((m) => m.channel.id === channel.id);
  if (!currentChannel) {
    currentChannel = userMessagesRepository.create({ user, channel, count: 0 });
    user.messages.push(currentChannel);
  }
  currentChannel.count++;
  await user.save();
};
