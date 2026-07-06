import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlaceOrderDto {
  @ApiProperty({
    example: '123 Main St, New York, NY 10001',
    description: 'Detailed shipping destination address',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
}
