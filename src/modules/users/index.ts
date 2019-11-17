import * as speakeasy from 'speakeasy'

const token = speakeasy.totp({
	secret: '123456',
	encoding: 'base32'
})

const tokenValidates = speakeasy.totp.verify({
	secret: '123456',
	encoding: 'base32',
	token,
	window: 0
})

console.log(tokenValidates)
