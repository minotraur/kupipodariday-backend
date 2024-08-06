import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wish } from '../wishes/wish.entity';
import { User } from '../users/user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const items = await this.wishesRepository.findByIds(
      createWishlistDto.items,
    );
    const owner = { id: createWishlistDto.owner } as DeepPartial<User>;
    const newWishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      items,
      owner,
    });
    return this.wishlistsRepository.save(newWishlist);
  }

  async findOne(
    id: number,
    query?: FindOneOptions<Wishlist>,
  ): Promise<Wishlist> {
    return this.wishlistsRepository.findOne({ where: { id }, ...query });
  }

  async findAll(query: FindManyOptions<Wishlist> = {}): Promise<Wishlist[]> {
    return this.wishlistsRepository.find(query);
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<void> {
    const wishlist = await this.wishlistsRepository.findOne({ where: { id } });
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    if (updateWishlistDto.items) {
      const items = await this.wishesRepository.findByIds(
        updateWishlistDto.items,
      );
      await this.wishlistsRepository.update(id, {
        ...updateWishlistDto,
        items,
      });
    } else {
      await this.wishlistsRepository.update(
        id,
        updateWishlistDto as QueryDeepPartialEntity<Wishlist>,
      );
    }
  }

  async removeOne(id: number): Promise<void> {
    await this.wishlistsRepository.delete(id);
  }
}
