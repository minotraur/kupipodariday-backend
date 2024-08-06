import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { WishesService } from '../wishes/wishes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MailerService } from '../mailer/mailer.service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOffer(@Body() offerData, @Request() req) {
    const wish = await this.wishesService.findOne({
      where: { id: offerData.item },
    });

    if (wish.owner.id === req.user.userId) {
      throw new ForbiddenException('You cannot fund your own wishes');
    }

    const totalRaised = wish.raised + offerData.amount;
    if (totalRaised > wish.price) {
      throw new ConflictException(
        'The total amount of contributions exceeds the price of the wish',
      );
    }

    offerData.user = req.user.userId;

    const newOffer = await this.offersService.create(offerData);

    // Send email to the wish owner
    await this.mailerService.sendMail({
      to: wish.owner.email,
      subject: 'New contribution to your wish',
      text: `User ${req.user.username} has contributed ${offerData.amount} to your wish "${wish.name}".`,
    });

    // Update the raised amount
    await this.wishesService.updateOne(wish.id, { raised: totalRaised });

    return newOffer;
  }
}
