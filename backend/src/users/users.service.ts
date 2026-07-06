import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userData: Partial<User>): Promise<User> {
    return this.usersRepository.create(userData);
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    return this.usersRepository.findByEmail(email, includePassword);
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.usersRepository.findByMobile(mobile);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.usersRepository.update(id, updateData);
  }

  async delete(id: string): Promise<User | null> {
    return this.usersRepository.delete(id);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const { email, mobile, name, dob } = updateProfileDto;
    
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User account not found');
    }

    const updateData: Partial<User> = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (dob !== undefined) {
      updateData.dob = dob ? new Date(dob) : undefined;
    }

    if (email !== undefined && email !== user.email) {
      const emailExists = await this.usersRepository.findByEmail(email);
      if (emailExists) {
        throw new ConflictException('Profile update failed: Email address is already in use');
      }
      updateData.email = email;
    }

    if (mobile !== undefined && mobile !== user.mobile) {
      const mobileExists = await this.usersRepository.findByMobile(mobile);
      if (mobileExists) {
        throw new ConflictException('Profile update failed: Mobile number is already in use');
      }
      updateData.mobile = mobile;
    }

    return this.usersRepository.update(userId, updateData);
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User account not found');
    }
    await this.usersRepository.delete(userId);
  }
}
