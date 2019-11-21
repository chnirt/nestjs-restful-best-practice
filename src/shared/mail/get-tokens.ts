
import { google } from 'googleapis'

const GMAIL_CLIENT_ID =
  '592071089720-5r7brh7kisl13s8ec0h6ig98f88nl9o7.apps.googleusercontent.com'
const GMAIL_CLIENT_SECRET = 'hZoBMmq4A7TmYVJVIBmTLwCp'
const GMAIL_CODE = '4/tgFmtahsfhMpVA_u9ShPbS-VhqafqpLJXYkb6ibsp3YHm-tgjfR2Ag0ccWxe7CCLk05St0s9X-KH6AU24_jS-3c'
const GMAIL_REDIRECT_URL = 'https://developers.google.com/oauthplayground'

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URL,
);

const getToken = async () => {
  const { tokens } = await oauth2Client.getToken(GMAIL_CODE);
  console.info(tokens);
};

getToken();
