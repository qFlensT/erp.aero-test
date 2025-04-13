import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/domain/services/auth/auth.service';
import { UserService } from 'src/domain/services/user/user.service';
import { NoAuthGuard } from '../guards/no-auth.guard';
import { SignUpBodyDto } from '../dto/sign-up.body.dto';
import { TokenPairDto } from '../dto/token-pair.dto';
import { SignInBodyDto } from '../dto/sign-in.body.dto';
import { RefreshTokenBodyDto } from '../dto/refresh-token.body.dto';
import { AuthGuard } from '../guards/auth.guard';
import { LogoutBodyDto } from '../dto/logout.body.dto';
import { Request } from 'express';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @UseGuards(NoAuthGuard)
  async signUp(@Body() { id, password }: SignUpBodyDto): Promise<TokenPairDto> {
    const passwordHash = await this.authService.hashPassword(password);
    const user = await this.userService.create({
      id,
      password: passwordHash,
    });

    // Тут можно было устанавливать рефреш сразу в куки, но я не знаю какой метод его хранения будет использоваться на клиенте
    return this.authService.generateTokens({ id: user.id });
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(NoAuthGuard)
  async signIn(@Body() { id, password }: SignInBodyDto): Promise<TokenPairDto> {
    const { password: passwordHash } = await this.userService.getById(id);
    const isPasswordCorrect = await this.authService.validatePassword(
      password,
      passwordHash,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid password');
    }

    // Тут можно было устанавливать рефреш сразу в куки, но я не знаю какой метод его хранения будет использоваться на клиенте
    return this.authService.generateTokens({ id });
  }

  @Post('/signin/new_token')
  @HttpCode(HttpStatus.OK)
  // Можно было сделать более гибко: проверять что токен валидный но просто истек
  @UseGuards(NoAuthGuard)
  async newToken(
    @Body() { refresh }: RefreshTokenBodyDto,
  ): Promise<TokenPairDto> {
    const payload = await this.authService.validateRefresh(refresh);

    if (!payload) {
      throw new UnauthorizedException('Token invalid, expired or revoked');
    }

    const [tokens] = await Promise.all([
      this.authService.generateTokens(payload),
      this.authService.revokeToken(refresh),
    ]);

    return tokens;
  }

  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async logout(
    @Body() { refresh }: LogoutBodyDto,
    @Req() req: Request,
  ): Promise<void> {
    // мы закидываем токен в гуарде
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    await this.authService.revokeTokens({ refresh, access: req['token']! });
  }

  @Get('info')
  @UseGuards(AuthGuard)
  info(@Req() req: Request) {
    // мы просто возвращаем payload из jwt, можно было бы валидировать респонс зодом, но это наша ответственность
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return req['user'];
  }
}
