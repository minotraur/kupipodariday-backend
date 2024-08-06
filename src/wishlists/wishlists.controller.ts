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
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWishlist(@Body() wishlistData, @Request() req) {
    wishlistData.owner = req.user.userId;
    return this.wishlistsService.create(wishlistData);
  }

  @Get(':id')
  async getWishlist(@Param('id') id: number) {
    return this.wishlistsService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateWishlist(
    @Param('id') id: number,
    @Body() updateData,
    @Request() req,
  ) {
    const wishlist = await this.wishlistsService.findOne({ where: { id } });
    if (wishlist.owner.id !== req.user.userId) {
      throw new UnauthorizedException('You can only edit your own wishlists');
    }
    await this.wishlistsService.updateOne(id, updateData);
    return this.wishlistsService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWishlist(@Param('id') id: number, @Request() req) {
    const wishlist = await this.wishlistsService.findOne({ where: { id } });
    if (wishlist.owner.id !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own wishlists');
    }
    await this.wishlistsService.removeOne(id);
  }

  @Get()
  async findAllWishlists() {
    return this.wishlistsService.findAll();
  }
}
