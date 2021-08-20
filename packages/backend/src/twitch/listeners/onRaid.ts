import { ChatRaidInfo, UserNotice } from 'twitch-chat-client/lib';
import twitch from '..';
import { Raid , typeorm } from '@taverna/typeorm';

const raidRepository = typeorm.getRepository(Raid);

export const onRaid = (channel: string, user: string, raidinfo: ChatRaidInfo, msg: UserNotice) => {
  const to = twitch.channels.find((c) => c.id === msg.tags.get('room-id'));
  const from = twitch.channels.find((c) => c.id === msg.tags.get('user-id'));

  if (!from || !to) return;

  const viewers = raidinfo.viewerCount;
  raidRepository.create({ to, from, viewers }).save();
};
