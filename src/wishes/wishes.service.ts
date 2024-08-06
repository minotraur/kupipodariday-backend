import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Wish } from './wish.entity';
import { User } from 'src/users/user.entity';

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

  async copyWish(id: number, ownerId: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wish) {
      throw new Error('Wish not found');
    }

    const newWish = this.wishesRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: { id: ownerId } as User,
      copied: 0,
    });

    wish.copied += 1;
    await this.wishesRepository.save(wish);

    return this.wishesRepository.save(newWish);
  }
}
