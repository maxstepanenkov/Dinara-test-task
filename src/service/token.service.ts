import jwt from 'jsonwebtoken';
import tokenModel from '../model/token.model';

class TokenService {
  generateTokens(payload: any): any {
    const accessToken = jwt.sign(payload, `${process.env.JWT_ACCESS_SECRET}`, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, `${process.env.JWT_REFRESH_TOKEN}`, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId: string, refreshToken: string): Promise<string> {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  validateAccessToken(token: string): any {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
      return userData;
    } catch(e) {
      return null;
    }
  }

  validateRefreshToken(token: string): any {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
      return userData;
    } catch(e) {
      return null;
    }
  }

  async findToken(refreshToken: string): Promise<string> {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }

  async removeToken(refreshToken: string): Promise<any> {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();