import { Inject, Provider } from '@nestjs/common';
import { google } from 'googleapis';
import { GOOGLE_OAUTH } from './google-oauth.constants';

const OAuth2 = google.auth.OAuth2;

export const InjectGoogleOAuthService = () => Inject(GOOGLE_OAUTH);

export const GoogleOAuthProvider: Provider = {
  provide: GOOGLE_OAUTH,
  useFactory: async () => {
    const oauth2Client = new OAuth2({
      clientId: process.env.AUTH__PROVIDERS__GOOGLE__CLIENT_ID,
      clientSecret: process.env.AUTH__PROVIDERS__GOOGLE__CLIENT_SECRET,
      forceRefreshOnFailure: true,
    });

    oauth2Client.setCredentials({
      refresh_token: process.env.AUTH__PROVIDERS__GOOGLE__REFRESH_TOKEN,
    });

    try {
      // Since we only have the refresh token, we need to get the access token
      await oauth2Client.refreshAccessToken();
    } catch (error) {
      console.error(
        'Error getting access token, review your credentials.',
        error,
      );
    }

    return oauth2Client;
  },
};
