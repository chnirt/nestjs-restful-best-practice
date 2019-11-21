import * as nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
import { google } from 'googleapis'

import { UserEntity } from '../../modules/users/user.entity'

import {
	AUTHOR,
	END_POINT,
	ISSUER,
	MAIL_USER,
	MAIL_PASS
} from '../../environments'

const USER = 'trinhchinchin@gmail.com'
const GMAIL_CLIENT_ID =
	'592071089720-5r7brh7kisl13s8ec0h6ig98f88nl9o7.apps.googleusercontent.com'
const GMAIL_CLIENT_SECRET = 'hZoBMmq4A7TmYVJVIBmTLwCp'
const GMAIL_CODE =
	'4/tQEvQrTEdStKPurIl2HIZcRoAv_XHiJkt2CH_K2s6fuakKwT4qK92wQJTr12PqgXm-EqTJYChjqo9Q2S10WoPP8'
const GMAIL_REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN =
	'1//044Zs3ueZIzy3CgYIARAAGAQSNwF-L9Ir6uYJ9Q0_B5-ATAfDoLLep2naVBaTup6IrNdpKDH3pfMF4L5QBvoPagZRM6rgxyuQaZI'

/**
 * Returns any by send email.
 *
 * @remarks
 * This method is part of the {@link shared/mail}.
 *
 * @param user - 1st input number
 * @param token - 2nd input number
 * @returns The any mean of `user` and `token`
 *
 * @beta
 */
export const sendMail = async (
	user: UserEntity,
	token: string
): Promise<any> => {
	const oauth2Client = new google.auth.OAuth2(
		GMAIL_CLIENT_ID,
		GMAIL_CLIENT_SECRET,
		GMAIL_REDIRECT_URL
	)

	// const GMAIL_SCOPES = [
	// 	'https://mail.google.com/',
	// 	'https://www.googleapis.com/auth/gmail.modify',
	// 	'https://www.googleapis.com/auth/gmail.compose',
	// 	'https://www.googleapis.com/auth/gmail.send',
	// ];

	// const url = oauth2Client.generateAuthUrl({
	// 	access_type: 'offline',
	// 	scope: GMAIL_SCOPES,
	// });

	// console.log(url)

	oauth2Client.getToken(GMAIL_CODE, function(err, tokens) {
		if (!err) {
			oauth2Client.setCredentials(tokens)
			console.log(tokens)
		}
	})
	// const { tokens } = await oauth2Client.getToken(CODE)
	// oauth2Client.setCredentials(tokens);

	// oauth2Client.setCredentials({
	// 	refresh_token: REFRESH_TOKEN
	// });
	// const accessToken = await oauth2Client.getAccessToken()
	// oauth2Client.setCredentials({
	// 	refresh_token: REFRESH_TOKEN
	// });

	// oauth2Client.on('tokens', (tokens) => {
	// 	if (tokens.refresh_token) {
	// 		// store the refresh_token in my database!
	// 		console.log(tokens.refresh_token);
	// 	}
	// 	console.log(tokens.access_token);
	// });

	// console.log(accessToken)

	const auth = {
		type: 'OAuth2',
		user: USER,
		clientId: GMAIL_CLIENT_ID,
		clientSecret: GMAIL_CLIENT_SECRET,
		refreshToken: REFRESH_TOKEN,
		accessToken:
			'ya29.Il-xB1V5V3crDFBRmXV3oSAedHI8sp5KHg27Efokbs5NnTyt0BKA8SRfdibD2-HxS0FaC6W5xecWYcSfsEruEawTwsNzj3W-KoIzqaW-88Q4ukKZWFMEJop3x8CUViBUCA'
	}

	const transporter = await nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth
	})

	const readHTMLFile = (path, callback) => {
		fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
			if (err) {
				callback(err)
			} else {
				callback(null, html)
			}
		})
	}

	readHTMLFile('./src/assets/templates/udacity-index.html', (err, html) => {
		const template = handlebars.compile(html)

		const common = {
			author: AUTHOR!,
			issuer: ISSUER!,
			ios: 'https://itunes.apple.com/us/app/chnirt',
			android: 'https://play.google.com/store/apps/chnirt',
			twitter: 'https://twitter.com/chnirt',
			facebook: 'https://www.facebook.com/trinhchinchinn',
			googleplus: 'https://plus.google.com/chnirt',
			linkedin:
				'https://www.linkedin.com/authwall?trk=gf&trkInfo=AQFSlEdMz0wy8AAAAW2cEMIYqabj7d0O-w7EMMY5W1BFRDacs5fcAbu4akPG8jrJQPG5-cNbLf-kaBHIfmW-f6a3WgaqAEjIG6reC_mLvY9n-mzZwZbcFf0q9XmrlkFVdVUH2I4=&originalReferer=https://www.facebook.com/&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fchin-tr%25E1%25BB%258Bnh-62200215a%3Ffbclid%3DIwAR289POrXez8UY6k2RQNEnNAjrtOto8H6zhFABlQ7HHCvpIS0afgQHxGGic',
			number: '1803',
			street: 'Su Van Hanh',
			city: 'Ho Chi Minh',
			country: 'Viet Nam',
			to: user.name
		}

		const replacements = {
			subject: 'Email OTP Verification',
			text1: 'To complete your sign up, please verify your OTP: ',
			button: token,
			text2:
				'This One Time Password is time sensitive. And in case of repeated unsuccessful attempts, the link will become invalid. Reinitiate the access request in case the OTP is expired',
			...common
		}

		const htmlToSend = template(replacements)

		const mailOptions = {
			from: 'Chnirt  📮:' + MAIL_USER, // sender address
			to: user.email, // list of receivers
			subject: replacements.subject,
			html: htmlToSend,
			attachments: [
				{
					path: './src/assets/images/logo.png',
					cid: 'unique@kreata.ee' // same cid value as in the html img src
				},
				{
					path: './src/assets/images/mail/ios.gif',
					cid: 'ios@chnirt.ee'
				},
				{
					path: './src/assets/images/mail/android.gif',
					cid: 'android@chnirt.ee'
				},
				{
					path: './src/assets/images/mail/twitter.jpg',
					cid: 'twitter@chnirt.ee'
				},
				{
					path: './src/assets/images/mail/facebook.jpg',
					cid: 'facebook@chnirt.ee'
				},
				{
					path: './src/assets/images/mail/googleplus.jpg',
					cid: 'googleplus@chnirt.ee'
				},
				{
					path: './src/assets/images/mail/linkedin.jpg',
					cid: 'linkedin@chnirt.ee'
				}
			]
		}

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err)
				// Logger.error(err.message)
			} else {
				console.log('Message sent: ' + JSON.parse(info))
				// Logger.debug(info.response.message, 'Nodemailer')
			}
			transporter.close()
		})
	})
}
