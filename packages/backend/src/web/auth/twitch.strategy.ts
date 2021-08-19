import { PassportStrategy } from '@nestjs/passport';
import { HttpService, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';

const clientID = process.env.TWITCH_CLIENTID;
const clientSecret = process.env.TWITCH_CLIENTSECRET;
const callbackURL = process.env.TWITCH_CALLBACKURL;
const scope = ['user:read:email'];

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor(private http: HttpService) {
    super({
      authorizationURL: `https://id.twitch.tv/oauth2/authorize?${stringify({
        client_id: clientID,
        redirect_uri: callbackURL,
        response_type: 'code',
        scope,
      })}`,
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      scope,
      clientID,
      clientSecret,
      callbackURL,
    });
  }

  async validate(accessToken: string) {
    const { data } = await this.http
      .get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENTID,
        },
      })
      .toPromise();

    return data?.data[0];
  }
}
