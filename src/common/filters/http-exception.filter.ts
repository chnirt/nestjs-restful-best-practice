import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException
} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()
		const statusCode = exception.getStatus()

		response.status(statusCode).json({
			statusCode,
			message: exception.message.message || exception.message.error,
			timestamp: new Date().toISOString(),
			path: request.url
		})
	}
}
