import * as TORM from 'typeorm'

export * from './entities/Channel';
export * from './entities/Raid';
export * from './entities/Session';
export * from './entities/Token';
export * from './entities/User';
export * from './entities/UserMessages';
export * from './entities/Event';

import { Channel } from './entities/Channel'
import { Raid } from './entities/Raid';
import { Session } from './entities/Session';
import { Token } from './entities/Token';
import { User } from './entities/User';
import { UserMessages } from './entities/UserMessages';
import { Event } from './entities/Event';

export const entities = [Channel, Raid, Session, Token, User, UserMessages, Event]

export const createConnection = async () => {
  const connectionOptions = await TORM.getConnectionOptions();

  return TORM.createConnection(Object.assign(connectionOptions, { entities }));
}

export const typeorm = TORM