import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { add } from 'date-fns';
import { CookieOptions, Response } from 'express';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { RegisterUserDto } from './dto/register-user.dto';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  expires: add(new Date(), { days: 30 }),
};

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  @Post('register')
  @ApiResponse(UserDto, { type: 'create' })
  @Serialize(UserDto)
  async register(
    @I18nLang() lang: string,
    @Body() registerUserDto: RegisterUserDto,
  ) {
    const user = await this.authService.register(registerUserDto, lang);
    const message = this.i18n.translate('auth.REGISTER_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto, 'user')
  async login(
    @I18nLang() lang: string,
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token, expiresIn } = await this.authService.login(
      loginDto,
      lang,
    );
    const message = this.i18n.translate('auth.LOGIN_MESSAGE', { lang });
    response.cookie('token', token, cookieOptions);
    return formatSuccessResponse(message, { user, token, expiresIn });
  }

  @Get('verify/:confirmationCode')
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto)
  async verify(
    @I18nLang() lang: string,
    @Param('confirmationCode') confirmationCode: string,
  ) {
    const user = await this.usersService.verify(confirmationCode);
    const message = this.i18n.translate('auth.VERIFY_MESSAGE', { lang });
    return formatSuccessResponse(message, user);
  }

  @Get('account')
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @ApiSecurity('auth-token')
  async getAccount(
    @I18nLang() lang: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const accountData = await this.usersService.findOne(user.id);
    const message = this.i18n.translate('auth.GET_ACCOUNT_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, accountData);
  }

  @Patch('update-account')
  @ApiResponse(UserDto, { type: 'update' })
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @ApiSecurity('auth-token')
  async updateAccount(
    @I18nLang() lang: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const accountData = await this.usersService.update(user.id, updateUserDto);
    const message = this.i18n.translate('auth.UPDATE_ACCOUNT_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, accountData);
  }

  @Patch('update-password')
  @ApiResponse(UserDto, { type: 'update' })
  @Serialize(UserDto, 'user')
  @UseGuards(AuthGuard)
  @ApiSecurity('auth-token')
  async updatePassword(
    @I18nLang() lang: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const {
      user: accountData,
      token,
      expiresIn,
    } = await this.authService.updatePassword(user.id, updatePasswordDto, lang);
    const message = this.i18n.translate('auth.UPDATE_PASSWORD_MESSAGE', {
      lang,
    });
    response.cookie('token', token, cookieOptions);
    return formatSuccessResponse(message, {
      accountData,
      token,
      expiresIn,
    });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto)
  async forgotPassword(
    @I18nLang() lang: string,
    @Body() { email }: ForgotPasswordDto,
  ) {
    const user = await this.authService.forgotPassword(email, lang);
    const message = this.i18n.translate(
      'auth.PASSWORD_RESET_EMAIL_SENT_MESSAGE',
      {
        lang,
        args: { email: user.email },
      },
    );
    return formatSuccessResponse(message, user);
  }

  @Patch('password-reset/:resetPasswordToken')
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto, 'user')
  async resetPassword(
    @I18nLang() lang: string,
    @Body() passwordResetDto: PasswordResetDto,
    @Param('resetPasswordToken') resetPasswordToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token, expiresIn } = await this.authService.passwordReset(
      resetPasswordToken,
      passwordResetDto,
      lang,
    );

    const message = this.i18n.translate('auth.UPDATE_PASSWORD_MESSAGE', {
      lang,
    });

    response.cookie('token', token, cookieOptions);
    return formatSuccessResponse(message, { user, token, expiresIn });
  }
}
