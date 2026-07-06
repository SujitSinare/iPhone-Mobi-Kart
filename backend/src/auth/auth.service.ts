import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Role } from '../common/constants/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, mobile, password, name, dob, role } = registerDto;

    // Check unique fields
    const emailExists = await this.usersService.findByEmail(email);
    if (emailExists) {
      throw new ConflictException('Register failed: Email address is already in use');
    }

    const mobileExists = await this.usersService.findByMobile(mobile);
    if (mobileExists) {
      throw new ConflictException('Register failed: Mobile number is already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await this.usersService.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      dob: dob ? new Date(dob) : undefined,
      role: role || Role.CUSTOMER,
      isActive: true,
    });

    const userObj = newUser.toObject();
    delete userObj.password;
    return userObj;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email, true);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Authentication failed: Invalid credentials or account is deactivated');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Authentication failed: Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      ...tokens,
    };
  }

  async adminLogin(adminLoginDto: AdminLoginDto) {
    const { email, password } = adminLoginDto;
    const user = await this.usersService.findByEmail(email, true);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Authentication failed: Invalid credentials or account is deactivated');
    }

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Access denied: Unauthorized role credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Authentication failed: Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      ...tokens,
    };
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Authentication failed: Invalid token or account deactivated');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch (e) {
      throw new UnauthorizedException('Authentication failed: Invalid or expired refresh token');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Authentication failed: User account not found');
    }

    const userWithPass = await this.usersService.findByEmail(user.email, true);

    const isMatch = await bcrypt.compare(oldPassword, userWithPass.password);
    if (!isMatch) {
      throw new BadRequestException('Password mismatch: Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await this.usersService.update(userId, { password: hashedNewPassword });

    return { message: 'Password changed successfully' };
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
