import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class AuthService {
  getDataFromToken(refresh: string) {
    try {
      const decode = verify(refresh, JWT_SECRET);
      return { id: decode.id, email: decode.email };
    } catch (err) {
      throw new HttpException(
        'Refresh token is expired',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  generateTokens(payload: { id: number; email: string }) {
    return {
      access: sign(payload, JWT_SECRET, { expiresIn: '3m' }),
      refresh: sign(payload, JWT_SECRET, { expiresIn: '3d' }),
    };
  }
}
