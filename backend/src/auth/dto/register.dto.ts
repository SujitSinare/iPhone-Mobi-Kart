import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/constants/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '9876543210', description: 'Unique mobile number of the user' })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ example: 'john@example.com', description: 'Unique email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '1995-05-15', description: 'Date of Birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty({ example: 'Password123!', description: 'Minimum 6 character password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.CUSTOMER, description: 'Role of the user' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
