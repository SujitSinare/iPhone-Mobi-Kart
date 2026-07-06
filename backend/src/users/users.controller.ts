import { Controller, Patch, Delete, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile details for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Profile details updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user inputs' })
  @ApiResponse({ status: 401, description: 'Unauthorized context' })
  @ApiResponse({ status: 409, description: 'Email or Mobile is already in use by another account' })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Delete('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user account document' })
  @ApiResponse({ status: 200, description: 'User account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized context' })
  @ApiResponse({ status: 404, description: 'User account not found' })
  async deleteAccount(@GetUser('id') userId: string) {
    await this.usersService.deleteAccount(userId);
    return { message: 'User account deleted successfully' };
  }
}
