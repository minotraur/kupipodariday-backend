import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWishlistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  items?: number[];
}
