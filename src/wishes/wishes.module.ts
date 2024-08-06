import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wish.entity';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  providers: [WishesService],
  controllers: [WishesController],
})
export class WishesModule {}
