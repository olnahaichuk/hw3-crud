import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';
import createHttpError from 'http-errors';

const googleOAuth2Client = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: env('GOOGLE_AUTH_REDIRECT_URI'),
});

export function generateOAuthURL() {
  return googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
}

export async function validateCode(code) {
  try {
    const response = await googleOAuth2Client.getToken(code);
   const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: response.tokens.id_token,
    });
   return ticket ; 
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 499
    ) {
      throw createHttpError(401, 'Unauthorized');
    } else {
      throw error;
    }
  }
}
