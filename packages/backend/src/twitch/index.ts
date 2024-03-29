import { RefreshableAuthProvider, StaticAuthProvider, ClientCredentialsAuthProvider } from 'twitch-auth';
import { ApiClient } from 'twitch';
import { typeorm } from '@taverna/typeorm';
import gl from 'glob';
import { Bot, BotCommand } from 'easy-twitch-bot';

import { Channel, Token, TokenType } from '@taverna/typeorm';
import { promisify } from 'util';
import { resolve } from 'path';
import { onJoin } from './listeners/onJoin';
import { onRaid } from './listeners/onRaid';
import { onMessage } from './listeners/onMessage';

class Twitch {
  private readonly tokenRepository = typeorm.getRepository(Token)
  private readonly channelRepository = typeorm.getRepository(Channel)

  channels: Channel[] = [];
  bot: Bot = null;
  api: ApiClient;
  private intervals = {
    channels: null,
  };

  constructor() {
    this.init();
  }

  private async init() {
    try {
      console.log(this.channelRepository.metadata.connection.options.entities)
      const clientId = process.env.TWITCH_CLIENTID;
      const clientSecret = process.env.TWITCH_CLIENTSECRET;
      this.api = new ApiClient({ authProvider: new ClientCredentialsAuthProvider(clientId, clientSecret) });

      const tokenData = await this.tokenRepository.findOne({
        type: TokenType.BOT,
      });
      if (!tokenData) return;

      const staticProvider = new StaticAuthProvider(clientId);
      const authProvider = new RefreshableAuthProvider(staticProvider, {
        clientSecret,
        refreshToken: tokenData.refreshToken,
        onRefresh: async ({ accessToken, refreshToken }) => {
          await this.tokenRepository.update(
            {
              type: TokenType.BOT,
            },
            {
              accessToken,
              refreshToken,
            },
          );
        },
      });

      const api = new ApiClient({ authProvider });
      const me = await api.helix.users.getMe();

      for (const channel of await (await api.kraken.teams.getTeamByName(process.env.TWITCH_TEAMNAME)).getUsers()) {
        const c = (await this.channelRepository.findOne(channel.id)) || this.channelRepository.create({ id: channel.id });
        c.username = channel.name;
        await c.save();

        this.channels.push(c);
      }

      this.bot = new Bot(api, {
        channels: this.channels.map((c) => c.username),
        commands: await this.getCommands(),
        prefix: process.env.BOT_PREFIX || 't!',
      });
      this.loadListeners();
    } catch (e) {
      console.error('Init failed', e);
    } finally {
      this.pullChannels();
      import('./modules/updateOnline');
    }
  }

  private async pullChannels() {
    this.intervals.channels = setTimeout(() => this.pullChannels(), 1 * 60 * 1000);
    try {
      const channels = await (await this.api.kraken.teams.getTeamByName(process.env.TWITCH_TEAMNAME)).getUsers();
      const me = await this.bot?.api?.helix.users.getMe();

      for (const channel of channels) {
        const currentChannel = this.channels.find(c => c.id === channel.id)
        if (currentChannel) {
          this.channelRepository.update({ id: channel.id }, { username: channel.name });
          continue;
        }
        if (currentChannel && currentChannel.username !== channel.name) {
          this.bot.chat.join(channel.name)
        }
        const newChannel = await this.channelRepository.create({ id: channel.id, username: channel.name }).save();
        this.channels.push(newChannel);
        this.bot?.chat.join(channel.name);
      }

      const noMoreInGroup = this.channels.filter((channelEntity) => {
        return !channels.some((channel) => channel.id === channelEntity.id);
      });

      for (const channel of noMoreInGroup) {
        this.channels = this.channels.filter((c) => c.id !== channel.id);
        this.bot?.chat.part(channel.username);
        await channel.remove();
      }
    } catch (e) {
      console.error('PullChannels failed', e);
    }
  }

  private async loadListeners() {
    this.bot?.chat.onJoin(onJoin);
    this.bot?.chat.onRaid(onRaid);
    this.bot?.chat.onMessage(onMessage);
  }

  private async getCommands() {
    try {
      const glob = promisify(gl);
      const files = await glob(resolve(__dirname, 'commands') + '/**.js');
      const commands: BotCommand[] = [];

      for (const file of files) {
        const imported: BotCommand = (await import(file)).default;
        commands.push(imported);
      }

      return commands;
    } catch (e) {
      console.error('Loading commands failed', e);
    }
  }
}

const twitch = new Twitch()
export default twitch;
