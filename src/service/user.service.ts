import bcrypt from 'bcrypt';
import UserModel from '../model/user.model';
import tokenService from './token.service';
import { UserDto } from '../dto/user.dto';
import { ApiError } from '../exception/api.error';

class UserService {
  async registration(name: string, email: string, password: string): Promise<any> {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with provided email ${email} already exist`);
    }
    const hashpassword = await bcrypt.hash(password, 3);
    const user = await UserModel.create({ email, name, password: hashpassword });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    }
  }

  async login(login: string, password: string): Promise<any> {
    console.log(login)
    const [user]: any = await UserModel.aggregate([
      {
        $match: {
          $or: [
            { name: login },
            { email: login }
          ]
        }
      }
    ]);
    if (!user) {
      throw ApiError.BadRequest('User with provided email does not exist');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Invalid password');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens( { ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    }
  }

  async logout(refreshToken: string): Promise<any> {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string): Promise<any> {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

export default new UserService();