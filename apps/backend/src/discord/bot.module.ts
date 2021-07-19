import { Module } from '@nestjs/common';
import { DiscordModule, TransformPipe, ValidationPipe } from 'discord-nestjs';
import { BotGateway } from './bot.gateway';
import { Intents } from 'discord.js';

@Module({
  imports: [
    DiscordModule.forRoot({
      token: process.env.DISCORD_BOT_TOKEN,
      commandPrefix: process.env.BOT_PREFIX,
      usePipes: [TransformPipe, ValidationPipe],
      ws: {
        intents: Intents.ALL,
      },
    }),
  ],
  providers: [BotGateway],
})
export class BotModule {}
