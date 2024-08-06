import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email is already taken');
      }
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username is already taken');
      }
    }

    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  async findAll(query: FindManyOptions<User> = {}): Promise<User[]> {
    return this.usersRepository.find(query);
  }

  async findMany(query: string): Promise<User[]> {
    return this.usersRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  async updateOne(id: number, updateData: Partial<User>): Promise<void> {
    await this.usersRepository.update(id, updateData);
  }

  async removeOne(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async checkUniqueConstraints(
    userId: number,
    updateData: Partial<User>,
  ): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: updateData.email }, { username: updateData.username }],
    });

    if (existingUser && existingUser.id !== userId) {
      if (existingUser.email === updateData.email) {
        throw new ConflictException('Email is already taken');
      }
      if (existingUser.username === updateData.username) {
        throw new ConflictException('Username is already taken');
      }
    }
  }
}
