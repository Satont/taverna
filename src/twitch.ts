import { RefreshableAuthProvider, StaticAuthProvider } from 'twitch-auth'
import { ApiClient } from 'twitch'
import { getRepository } from 'typeorm'
import gl from 'glob'
import { Bot, BotCommand } from 'easy-twitch-bot'

import { Token, TokenType } from './entities/Token'
import { Channel } from './entities/Channel'
import { Raid } from './entities/Raid'
import { promisify } from 'util'
import { resolve } from 'path'

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
    this.bot.chat.onJoin((channel) => console.info(`Joined ${channel}`))
    this.bot.chat.onRaid((channel, user, raidinfo, msg) => {
      /* Map(20) {
        'badge-info' => '',
        'badges' => '',
        'color' => '',
        'display-name' => 'amoralsongs',
        'emotes' => '',
        'flags' => '',
        'id' => '4cb0902e-2587-4c43-a4cf-b80aa6c680a3',
        'login' => 'amoralsongs',
        'mod' => '0',
        'msg-id' => 'raid',
        'msg-param-displayName' => 'amoralsongs',
        'msg-param-login' => 'amoralsongs',
        'msg-param-profileImageURL' => 'https://static-cdn.jtvnw.net/user-default-pictures-uv/dbdc9198-def8-11e9-8681-784f43822e80-profile_image-70x70.png',
        'msg-param-viewerCount' => '1',
        'room-id' => '128644134',
        'subscriber' => '0',
        'system-msg' => '1 raiders from amoralsongs have joined!',
        'tmi-sent-ts' => '1607379330274',
        'user-id' => '584160819',
        'user-type' => ''
      } */

      const to = this.channels.find(c => c.id === msg.tags.get('room-id'))
      const from = this.channels.find(c => c.id === msg.tags.get('user-id'))

      if (!from || !to) return

      this.raidsRepository.create({ to, from }).save()
    })
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
