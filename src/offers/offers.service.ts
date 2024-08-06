import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Offer } from './offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  async create(offer: Partial<Offer>): Promise<Offer> {
    const newOffer = this.offersRepository.create(offer);
    return this.offersRepository.save(newOffer);
  }

  async findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    return this.offersRepository.findOne(query);
  }

  async findAll(query: FindManyOptions<Offer> = {}): Promise<Offer[]> {
    return this.offersRepository.find(query);
  }

  async updateOne(id: number, updateData: Partial<Offer>): Promise<void> {
    await this.offersRepository.update(id, updateData);
  }

  async removeOne(id: number): Promise<void> {
    await this.offersRepository.delete(id);
  }
}
