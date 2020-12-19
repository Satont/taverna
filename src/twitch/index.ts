import { RefreshableAuthProvider, StaticAuthProvider } from 'twitch-auth'
import { ApiClient } from 'twitch'
import { getRepository } from 'typeorm'
import gl from 'glob'
import { Bot, BotCommand } from 'easy-twitch-bot'

import { Token, TokenType } from '../entities/Token'
import { Channel } from '../entities/Channel'
import { Raid } from '../entities/Raid'
import { promisify } from 'util'
import { resolve } from 'path'
import { onJoin } from './listeners/onJoin'
import { onRaid } from './listeners/onRaid'
import { onMessage } from './listeners/onMessage'

class Twitch {
  private readonly tokenRepository = getRepository(Token)
  private readonly channelRepository = getRepository(Channel)
  private readonly raidsRepository = getRepository(Raid)

  channels: Channel[] = []
  bot: Bot = null
  private intervals = {
    channels: null,
  }

  constructor() {
    this.init()
  }

  private async init() {
    this.getCommands()
    const clientId = process.env.TWITCH_CLIENTID
    const clientSecret = process.env.TWITCH_CLIENTSECRET

    const tokenData = await this.tokenRepository.findOne({
      type: TokenType.BOT,
    })
    if (!tokenData) return

    const staticProvider = new StaticAuthProvider(clientId)
    const authProvider = new RefreshableAuthProvider(staticProvider, {
      clientSecret,
      refreshToken: tokenData.refreshToken,
      onRefresh: async ({ accessToken, refreshToken }) => {
        await this.tokenRepository.update({
          type: TokenType.BOT
        }, {
          accessToken,
          refreshToken,
        })
      }
    })

    const api = new ApiClient({ authProvider })
    const me = await api.helix.users.getMe()

    for (const channel of await (await api.kraken.teams.getTeamByName('sad_inside')).getUsers()) {
      const c = await this.channelRepository.findOne(channel.id) || this.channelRepository.create({ id: channel.id })
      c.username = channel.name
      await c.save()

      this.channels.push(c)
      api.helix.users.createFollow(me.id, c.id)
    }

    this.bot = new Bot(api as any, {
      channels: this.channels.map(c => c.username),
      commands: await this.getCommands()
    })

    this.loadListeners()
    this.pullChannels()

    import('./modules/updateOnline')
  }

  private async pullChannels() {
    this.intervals.channels = setTimeout(() => this.pullChannels(), 5 * 60 * 1000)
    const channels = await (await this.bot.api.kraken.teams.getTeamByName(process.env.TWITCH_TEAMNAME)).getUsers()
    const me = await this.bot.api.helix.users.getMe()

    for (const channel of channels) {
      if (this.channels.find(c => c.id === channel.id)) continue
      const newChannel = this.channelRepository.create({ id: channel.id, username: channel.name })
      await newChannel.save()
      this.channels.push(newChannel)
      this.bot.chat.join(channel.name)
      this.bot.api.helix.users.createFollow(me.id, channel.id)
    }

    const noMoreInGroup = this.channels.filter(channel => {
      return !channels.some(c => c.id === channel.id)
    })

    for (const channel of noMoreInGroup) {
      this.channels = this.channels.filter(c => c.id !== channel.id)
      this.bot.chat.part(channel.username)
      await channel.remove()
    }
  }

  private async loadListeners() {
    this.bot.chat.onJoin(onJoin)
    this.bot.chat.onRaid(onRaid)
    this.bot.chat.onMessage(onMessage)
  }

  private async getCommands() {
    const glob = promisify(gl)
    const files = await glob(resolve(process.cwd(), 'dist', 'commands') + '/**.js')
    const commands: BotCommand[] = []

    for (const file of files) {
      const imported: BotCommand = (await import(file)).default
      commands.push(imported)
    }

    return commands
  }
}

export default new Twitch()
