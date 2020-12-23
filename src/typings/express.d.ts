import { HelixUser } from 'twitch/lib'

declare module 'express' {
  interface Request {
    user: HelixUser
  }
}
