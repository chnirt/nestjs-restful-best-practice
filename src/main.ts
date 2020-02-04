import { NestFactory } from '@nestjs/core'
import { Logger, InternalServerErrorException } from '@nestjs/common'
import chalk from 'chalk'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import * as fs from 'fs'
import { AppModule } from './app.module'

import {
	ValidationPipe,
	LoggerMiddleware,
	TimeoutInterceptor,
	LoggingInterceptor,
	HttpExceptionFilter
} from './common'
import { MyLogger } from './config'

import { NODE_ENV, DOMAIN, PORT } from './environments'

declare const module: any

async function bootstrap() {
	try {
		// const httpsOptions = {
		// 	key: fs.readFileSync('ssl/private.key'),
		// 	cert: fs.readFileSync('ssl/certificate.crt'),
		// 	ca: fs.readFileSync('ssl/ca_bundle.crt'),
		// }

		const app = await NestFactory.create(AppModule, {
			// httpsOptions,
			logger: new MyLogger(),
			cors: true
		})

		app.use(helmet())

		// body parser
		app.use(bodyParser.json())
		app.use(bodyParser.urlencoded())
		// app.use(bodyParser.json({ limit: '2mb' }))
		// app.use(
		// 	bodyParser.urlencoded({
		// 		limit: '2mb',
		// 		extended: true,
		// 		parameterLimit: 2000
		// 	})
		// )

		app.use(
			rateLimit({
				windowMs: 15 * 60 * 1000, // 15 minutes
				max: 10000 // limit each IP to 10000 requests per windowMs
			})
		)

		// // adapter for e2e testing
		const httpAdapter = app.getHttpAdapter()

		// loggerMiddleware
		// tslint:disable-next-line:no-unused-expression
		NODE_ENV !== 'testing' && app.use(LoggerMiddleware)

		// interceptors
		// app.useGlobalInterceptors(new LoggingInterceptor())
		// app.useGlobalInterceptors(new TimeoutInterceptor())
		// app.useGlobalFilters(new HttpExceptionFilter())

		// global nest setup
		app.useGlobalPipes(new ValidationPipe())

		// Starts listening to shutdown hooks
		app.enableShutdownHooks()

		const options = new DocumentBuilder()
			.setTitle('Nestjs Restful Best Practice')
			.setVersion('3.0.0')
			// .setHost('nestjs-restful-best-practice.herokuapp.com')
			.setBasePath('/v1')
			.setDescription('built NestJS, TypeORM, MongoDB')
			.setTermsOfService(
				'https://github.com/chnirt/nestjs-restful-best-practice/blob/master/LICENSE'
			)
			.setContactEmail('trinhchinchin@gmail.com')
			.setLicense(
				'MIT License',
				'https://github.com/chnirt/nestjs-restful-best-practice/blob/master/LICENSE'
			)
			.setExternalDoc('For more information', 'http://swagger.io')
			.setSchemes(NODE_ENV !== 'production' ? 'http' : 'https')
			.addBearerAuth('Authorization', 'header')
			.addTag('chnirt', 'developer')
			.build()

		const document = SwaggerModule.createDocument(app, options)
		SwaggerModule.setup('api', app, document)

		app.setGlobalPrefix('/v1')

		const server = await app.listen(PORT!)

		// hot module replacement
		if (module.hot) {
			module.hot.accept()
			module.hot.dispose(() => app.close())
		}

		NODE_ENV !== 'production'
			? Logger.log(
					`🚀  Server ready at https://${DOMAIN!}:${chalk
						.hex('#87e8de')
						.bold(`${PORT!}`)}`,
					'Bootstrap'
			  )
			: Logger.log(
					`🚀  Server is listening on port ${chalk
						.hex('#87e8de')
						.bold(`${PORT!}`)}`,
					'Bootstrap'
			  )
	} catch (error) {
		// logger.error(error)
		Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false)
		process.exit()
		throw new InternalServerErrorException(error)
	}
}
bootstrap().catch(e => {
	throw e
})
