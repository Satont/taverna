import { Injectable } from '@nestjs/common';
import { Event, typeorm } from '@taverna/typeorm';
import { EventsList } from './validations/EventsList';
import { Client, DiscordClientProvider } from 'discord-nestjs';
import { MessageEmbed, TextChannel } from 'discord.js';
import { dayjs } from '../../helpers/dayjs';

@Injectable()
export class EventsService {
  private readonly repository = typeorm.getRepository(Event);
  @Client()
  private readonly discordClient: DiscordClientProvider;

  async getEventsList(query: EventsList) {
    const [events, total] = await Promise.all([
      this.repository.find({
        relations: ['author', 'participants'],
        take: Number(query.limit),
        skip: Number(query.limit) * (Number(query.page) - 1),
        order: {
          active: 'DESC',
          createdAt: 'DESC',
        },
      }),
      this.repository.count(),
    ]);
    return { events, total };
  }

  getUpcomingEvents() {
    return this.repository.find({ where: { date: typeorm.MoreThanOrEqual(new Date().toISOString()) } });
  }

  getEvent(id: string | number) {
    return this.repository.findOne(id, { relations: ['author', 'participants'] });
  }

  joinInEvent(eventId: string, channelId: string) {
    return typeorm.getConnection().createQueryBuilder().relation(Event, 'participants').of(eventId).add(channelId);
  }

  partFromEvent(eventId: string, channelId: string) {
    return typeorm.getConnection().createQueryBuilder().relation(Event, 'participants').of(eventId).remove(channelId);
  }

  async create(data: Partial<Event>, authorId: string) {
    const { participants, ...query } = data;
    const newEvent = await this.repository.create({ ...query, active: true, author: { id: authorId } }).save();

    if (participants?.length) {
      await typeorm.getConnection().createQueryBuilder().relation(Event, 'participants').of(newEvent.id).add(participants);
    }

    const event = await this.getEvent(newEvent.id);

    const channel = this.discordClient.getClient().channels.cache.get(process.env.DISCORD_BOT_CHANNELID) as TextChannel;
    if (channel) {
      const embed = new MessageEmbed({
        description: `У нас новый ивент от ${event.author.username}!\n\n${event.description}`,
        fields: [
          {
            name: 'Ивент',
            value: event.name,
            inline: true,
          },
        ],
        color: '#03fc7b',
      });

      if (event.date) {
        embed.addField('Дата проведения', dayjs(event.date).format('L LT'), true);
      }

      channel.send({
        content: `<@&${process.env.DISCORD_BOT_ROLEID}>`,
        embeds: [embed]
      });
    }

    return event;
  }

  async update(data: Partial<Event>, authorId: string) {
    const { participants, ...query } = data;
    const event = await this.repository.findOne({ where: { id: data.id, author: { id: authorId } }, relations: ['participants'] });
    await this.repository.update(event.id, query);
    await typeorm.getConnection().createQueryBuilder().relation(Event, 'participants').of(data.id).addAndRemove(participants, event.participants);

    return await this.getEvent(event.id);
  }
}
