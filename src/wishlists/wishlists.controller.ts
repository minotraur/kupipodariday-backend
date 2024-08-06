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
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto, @Request() req) {
    return this.wishlistsService.create({
      ...createWishlistDto,
      owner: req.user.userId,
    });
  }

  @Get()
  async findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Request() req,
  ) {
    const wishlist = await this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== req.user.userId) {
      throw new ForbiddenException('You can only update your own wishlists');
    }
    return this.wishlistsService.updateOne(Number(id), updateWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const wishlist = await this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own wishlists');
    }
    await this.wishlistsService.removeOne(Number(id));
    return { message: 'Wishlist deleted successfully' };
  }
}
