import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: '65e7d56e72c834a34bcf1b54', description: 'Product ID to add to cart' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, default: 1, description: 'Quantity of product' })
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
