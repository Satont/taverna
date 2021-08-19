import { HelixUserData } from 'twitch';

declare module 'express' {
  interface Request {
    user: HelixUserData;
  }
}
