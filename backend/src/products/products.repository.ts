import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const newProduct = new this.productModel(productData);
    return newProduct.save();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).populate('createdBy', 'name email').exec();
  }

  async update(id: string, updateData: Partial<Product>): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async findWithPagination(
    filterQuery: any,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ) {
    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [docs, total] = await Promise.all([
      this.productModel
        .find(filterQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .exec(),
      this.productModel.countDocuments(filterQuery).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      docs,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async count(): Promise<number> {
    return this.productModel.countDocuments().exec();
  }

  async findLowStock(threshold = 10): Promise<Product[]> {
    return this.productModel.find({ stock: { $lte: threshold } }).exec();
  }
}
