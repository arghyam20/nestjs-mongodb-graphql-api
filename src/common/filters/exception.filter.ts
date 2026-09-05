import {
  Catch,
  HttpException,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    const message =
      exception instanceof HttpException
        ? exception.getResponse()["message"] || exception.message
        : exception.message || "Internal Server Error";

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof ThrottlerException) {
      return {
        status: status,
        success: false,
        message: 'Too Many Requests',
        data: null,
      };
    } else if (exception instanceof UnauthorizedException) {
      return {
        status: 301,
        success: false,
        message: 'Unauthorized',
        data: null,
      };
    } else {
      return {
        status: status,
        success: false,
        message: message,
        data: null,
      };
    }
  }
}
