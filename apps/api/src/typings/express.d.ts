import { HelixUser } from 'twitch';

declare module 'express' {
  interface Request {
    user: HelixUser;
  }
}
