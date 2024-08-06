import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HashService } from 'src/auth/hash.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return this.usersService.findOne({ where: { id: req.user.userId } });
  }

  @Get(':username')
  async getUserProfile(@Param('username') username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Request() req, @Body() updateData) {
    if (updateData.password) {
      updateData.password = await this.hashService.hashPassword(
        updateData.password,
      );
    }
    await this.usersService.updateOne(req.user.userId, updateData);
    return this.usersService.findOne({ where: { id: req.user.userId } });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query('query') query: string) {
    return this.usersService.findMany(query);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData,
    @Request() req,
  ) {
    if (id !== req.user.userId) {
      throw new UnauthorizedException('You can only edit your own profile');
    }
    // Check if password is being updated and hash it
    if (updateData.password) {
      updateData.password = await this.hashService.hashPassword(
        updateData.password,
      );
    }
    await this.usersService.updateOne(id, updateData);
    return this.usersService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Request() req) {
    if (id !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own profile');
    }
    await this.usersService.removeOne(id);
  }
}
