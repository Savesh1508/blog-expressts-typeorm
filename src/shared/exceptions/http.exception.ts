import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class HttpException extends Error {
  constructor(
    public status: StatusCodes | (number & {}),
    public description: ReasonPhrases | (string & {}),
    public message: string
  ) {
    super(message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = ReasonPhrases.BAD_REQUEST) {
    super(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = ReasonPhrases.UNAUTHORIZED) {
    super(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = ReasonPhrases.FORBIDDEN) {
    super(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = ReasonPhrases.NOT_FOUND) {
    super(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR) {
    super(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR,
      message
    );
  }
}