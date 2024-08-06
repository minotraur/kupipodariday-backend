import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(@Body() wishData, @Request() req) {
    wishData.owner = req.user.userId;
    return this.wishesService.create(wishData);
  }

  @Get(':id')
  async getWish(@Param('id') id: number) {
    return this.wishesService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateWish(
    @Param('id') id: number,
    @Body() updateData,
    @Request() req,
  ) {
    const wish = await this.wishesService.findOne({ where: { id } });
    if (wish.owner.id !== req.user.userId) {
      throw new UnauthorizedException('You can only edit your own wishes');
    }
    if (wish.offers.length > 0 && updateData.price) {
      throw new ForbiddenException(
        'Cannot change price if there are already offers',
      );
    }
    if (updateData.raised) {
      delete updateData.raised;
    }
    await this.wishesService.updateOne(id, updateData);
    return this.wishesService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWish(@Param('id') id: number, @Request() req) {
    const wish = await this.wishesService.findOne({ where: { id } });
    if (wish.owner.id !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own wishes');
    }
    await this.wishesService.removeOne(id);
  }

  @Get()
  async findAllWishes() {
    return this.wishesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Request() req) {
    return this.wishesService.copyWish(id, req.user.userId);
  }
}
