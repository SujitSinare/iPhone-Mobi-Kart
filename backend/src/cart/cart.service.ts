import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartsRepository } from './carts.repository';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { Cart } from './schemas/cart.schema';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly cartsRepository: CartsRepository,
    private readonly productsService: ProductsService
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartsRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartsRepository.create(userId);
    }
    return cart;
  }

  async addItem(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const { productId, quantity } = addToCartDto;

    const product = await this.productsService.findById(productId);
    if (!product.isAvailable) {
      throw new BadRequestException('Operation failed: Product is not available');
    }

    const cartItemIndex = cart.products.findIndex((item) => {
      const id = item.productId && (item.productId as any)._id
        ? (item.productId as any)._id.toString()
        : item.productId.toString();
      return id === productId;
    });

    let targetQuantity = quantity;
    if (cartItemIndex > -1) {
      targetQuantity += cart.products[cartItemIndex].quantity;
    }

    if (product.stock < targetQuantity) {
      throw new BadRequestException(
        `Operation failed: Insufficient stock. Only ${product.stock} items left, you requested total of ${targetQuantity} items`
      );
    }

    if (cartItemIndex > -1) {
      cart.products[cartItemIndex].quantity = targetQuantity;
    } else {
      cart.products.push({
        productId: new Types.ObjectId(productId) as any,
        quantity,
        price: product.price,
      });
    }

    await this.recalculateCart(cart);
    return this.cartsRepository.save(cart);
  }

  async updateQuantity(
    userId: string,
    productId: string,
    updateQuantityDto: UpdateQuantityDto
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const { quantity } = updateQuantityDto;

    const cartItemIndex = cart.products.findIndex((item) => {
      const id = item.productId && (item.productId as any)._id
        ? (item.productId as any)._id.toString()
        : item.productId.toString();
      return id === productId;
    });

    if (cartItemIndex === -1) {
      throw new NotFoundException('Operation failed: Product not found in cart');
    }

    const product = await this.productsService.findById(productId);
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Operation failed: Insufficient stock. Only ${product.stock} items left, you requested ${quantity}`
      );
    }

    cart.products[cartItemIndex].quantity = quantity;

    await this.recalculateCart(cart);
    return this.cartsRepository.save(cart);
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const cartItemIndex = cart.products.findIndex((item) => {
      const id = item.productId && (item.productId as any)._id
        ? (item.productId as any)._id.toString()
        : item.productId.toString();
      return id === productId;
    });

    if (cartItemIndex === -1) {
      throw new NotFoundException('Operation failed: Product not found in cart');
    }

    cart.products.splice(cartItemIndex, 1);

    await this.recalculateCart(cart);
    return this.cartsRepository.save(cart);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    cart.products = [];
    cart.quantity = 0;
    cart.subtotal = 0;
    cart.total = 0;
    await this.cartsRepository.save(cart);
  }

  private async recalculateCart(cart: Cart): Promise<Cart> {
    let totalQty = 0;
    let subtotal = 0;
    let total = 0;

    for (const item of cart.products) {
      const pId = item.productId && (item.productId as any)._id
        ? (item.productId as any)._id.toString()
        : item.productId.toString();
      const product = await this.productsService.findById(pId);
      if (product) {
        item.price = product.price;
        totalQty += item.quantity;
        subtotal += product.price * item.quantity;

        // Apply discount check
        const discountPercentage = product.discount || 0;
        const discountedPrice = product.price - (product.price * discountPercentage) / 100;
        total += discountedPrice * item.quantity;
      }
    }

    cart.quantity = totalQty;
    cart.subtotal = Number(subtotal.toFixed(2));
    cart.total = Number(total.toFixed(2));

    return cart;
  }
}
