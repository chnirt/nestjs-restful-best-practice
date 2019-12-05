import {
	ExceptionFilter,
	Catch,
	HttpException,
	ArgumentsHost,
	HttpStatus
} from '@nestjs/common'

@Catch()
export class ErrorFilter implements ExceptionFilter {
	catch(error: Error, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse()
		const status =
			error instanceof HttpException
				? error.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		if (status === HttpStatus.UNAUTHORIZED) {
			return response.status(status).render('views/401')
		}
		if (status === HttpStatus.NOT_FOUND) {
			return response.status(status).render('views/404')
		}
		if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
			if (process.env.NODE_ENV === 'production') {
				// tslint:disable-next-line: no-console
				console.error(error.stack)
				return response.status(status).render('views/500')
			} else {
				const message = error.stack
				return response.status(status).send(message)
			}
		}
	}
}
