import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>
  ) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.cartModel
      .findOne({ userId })
      .populate('products.productId')
      .exec();
  }

  async create(userId: string): Promise<Cart> {
    const newCart = new this.cartModel({
      userId,
      products: [],
      quantity: 0,
      subtotal: 0,
      total: 0,
    });
    return newCart.save();
  }

  async save(cart: Cart): Promise<Cart> {
    // If the document is initialized as a Mongoose document, we can call save.
    const savedCart = await cart.save();
    return savedCart.populate('products.productId');
  }

  async deleteByUserId(userId: string): Promise<any> {
    return this.cartModel.deleteOne({ userId }).exec();
  }
}
