import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve logged-in user shopping cart details' })
  @ApiResponse({ status: 200, description: 'Shopping cart details retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized context' })
  async getCart(@GetUser('id') userId: string) {
    return this.cartService.getOrCreateCart(userId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add product item to shopping cart' })
  @ApiResponse({ status: 200, description: 'Product item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Invalid item parameters or insufficient stock levels' })
  @ApiResponse({ status: 401, description: 'Unauthorized context' })
  async addItem(
    @GetUser('id') userId: string,
    @Body() addToCartDto: AddToCartDto
  ) {
    return this.cartService.addItem(userId, addToCartDto);
  }

  @Patch(':productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modify item quantity in shopping cart' })
  @ApiResponse({ status: 200, description: 'Item quantity modified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid quantity levels or insufficient stock' })
  @ApiResponse({ status: 401, description: 'Unauthorized context' })
  @ApiResponse({ status: 404, description: 'Product item not found in cart' })
  async updateQuantity(
    @GetUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() updateQuantityDto: UpdateQuantityDto
  ) {
    return this.cartService.updateQuantity(userId, productId, updateQuantityDto);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove product item from cart' })
  @ApiResponse({ status: 200, description: 'Product item removed from cart successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized context' })
  @ApiResponse({ status: 404, description: 'Product item not found in cart' })
  async removeItem(
    @GetUser('id') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear all items from shopping cart' })
  @ApiResponse({ status: 200, description: 'Shopping cart cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized context' })
  async clearCart(@GetUser('id') userId: string) {
    await this.cartService.clearCart(userId);
    return { message: 'Cart cleared successfully' };
  }
}
