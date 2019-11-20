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

const OAuth2 = google.auth.OAuth2;

const USER = 'trinhchinchin@gmail.com'
const CLIENT_ID =
	'592071089720-5r7brh7kisl13s8ec0h6ig98f88nl9o7.apps.googleusercontent.com'
const CLIENT_SECRET = 'hZoBMmq4A7TmYVJVIBmTLwCp'
const REFRESH_TOKEN = '1//04FMBffBo6WFrCgYIARAAGAQSNwF-L9Irr-1O3EjFZ2mUcc0q3zthUT91PIaRNA7NzKpCxZwg_jTMJfipI3ng55gGTSwNi_LX2jA'

const oauth2Client = new OAuth2(
	CLIENT_ID, CLIENT_SECRET,
	'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
	refresh_token: REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken()

const auth = {
	type: 'OAuth2',
	user: USER,
	clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	refreshToken: REFRESH_TOKEN,
	accessToken
}
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
	const transporter = await nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		// secure: false, // true
		// host: 'smtp.gmail.com',
		// port: 587, // 465
		// tls: {
		// 	rejectUnauthorized: false
		// },
		auth
	})

	// transporter.set('oauth2_provision_cb', (user, renew, callback) => {
	// 	let accessToken = userTokens[user]
	// 	if (!accessToken) {
	// 		return callback(new Error('Unknown user'))
	// 	} else {
	// 		return callback(null, accessToken)
	// 	}
	// })

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
