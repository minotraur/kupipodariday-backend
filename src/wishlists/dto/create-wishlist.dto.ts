import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  items: number[];

  @IsInt()
  owner: number;
}
