import { INext } from "../interface/INext.interface";
import { IRequest } from "../interface/IRequest.interface";
import { IResponse } from "../interface/IResponse.interface";
import { ApiError } from "../exception/api.error";
import tokenService from "../service/token.service";

export default function(req: IRequest, res: IResponse, next: INext) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch(e) {
    return next(ApiError.UnauthorizedError());
  }
}