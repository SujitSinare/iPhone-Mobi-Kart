import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  IsBoolean,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro Max', description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Apple', description: 'Manufacturer brand' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'iPhones', description: 'Product category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'A3106', description: 'Product hardware model code' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    example: 'Featuring a strong and lightweight titanium design with new contoured edges.',
    description: 'Detailed description of the product',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Natural Titanium', description: 'Product color variant' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: '256GB', description: 'Storage capacity' })
  @IsString()
  @IsNotEmpty()
  storage: string;

  @ApiProperty({
    example: 'https://images.example.com/iphone-15-pro-max.png',
    description: 'Main product image URL',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiPropertyOptional({
    type: [String],
    example: [
      'https://images.example.com/iphone-15-pro-max-side.png',
      'https://images.example.com/iphone-15-pro-max-back.png',
    ],
    description: 'Additional product images',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @ApiProperty({ example: 1199, description: 'Base selling price in USD' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 10, default: 0, description: 'Discount percentage (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty({ example: 45, description: 'Stock quantity available' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 4.8, default: 0, description: 'Rating (0-5)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: true, default: true, description: 'Product availability flag' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
