import { IRequest } from '../interface/IRequest.interface';
import { IResponse } from '../interface/IResponse.interface';
import { INext } from '../interface/INext.interface';
import userService from '../service/user.service';
import { validationResult } from 'express-validator';
import { ApiError } from '../exception/api.error';

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;


class UserController {
  async registration(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { name, email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const userData = await userService.registration(name, email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: MAX_AGE, httpOnly: true } )
      return res.json(userData);
    } catch(e) {
      next(e);
    }
  }

  async login(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { login, password } = req.body;
      const userData = await userService.login(login, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: MAX_AGE, httpOnly: true } )
      return res.json(userData);
    } catch(e) {
      next(e);
    }
  }

  async logout(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch(e) {
      next(e)
    }
  }

  async refresh(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken)
    } catch(e) {
      next(e);
    }
  }
}

export default new UserController();