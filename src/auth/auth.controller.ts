import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  refreshToken(@Body() body: { refresh: string }) {
    const { refresh } = body;
    const data = this.authService.getDataFromToken(refresh);

    const tokens = this.authService.generateTokens(data);

    return tokens;
  }
}
