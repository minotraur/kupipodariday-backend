import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Wish } from './wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(wish: Partial<Wish>): Promise<Wish> {
    const newWish = this.wishesRepository.create(wish);
    return this.wishesRepository.save(newWish);
  }

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishesRepository.findOne(query);
  }

  async findAll(query: FindManyOptions<Wish> = {}): Promise<Wish[]> {
    return this.wishesRepository.find(query);
  }

  async updateOne(id: number, updateData: Partial<Wish>): Promise<void> {
    await this.wishesRepository.update(id, updateData);
  }

  async removeOne(id: number): Promise<void> {
    await this.wishesRepository.delete(id);
  }
}
