import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>
  ) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    const newOrder = new this.orderModel(orderData);
    return newOrder.save();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderModel
      .findById(id)
      .populate('userId', 'name email mobile')
      .populate('items.productId')
      .exec();
  }

  async update(id: string, updateData: Partial<Order>): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId')
      .exec();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('items.productId')
      .exec();
  }

  async count(): Promise<number> {
    return this.orderModel.countDocuments().exec();
  }

  async sumRevenue(): Promise<number> {
    const result = await this.orderModel
      .aggregate([
        { $match: { orderStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ])
      .exec();
    return result[0]?.total || 0;
  }

  async findRecent(limit = 5): Promise<Order[]> {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .exec();
  }
}
