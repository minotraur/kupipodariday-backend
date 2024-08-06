import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(wishlist: Partial<Wishlist>): Promise<Wishlist> {
    const newWishlist = this.wishlistsRepository.create(wishlist);
    return this.wishlistsRepository.save(newWishlist);
  }

  async findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistsRepository.findOne(query);
  }

  async findAll(query: FindManyOptions<Wishlist> = {}): Promise<Wishlist[]> {
    return this.wishlistsRepository.find(query);
  }

  async updateOne(id: number, updateData: Partial<Wishlist>): Promise<void> {
    await this.wishlistsRepository.update(id, updateData);
  }

  async removeOne(id: number): Promise<void> {
    await this.wishlistsRepository.delete(id);
  }
}
