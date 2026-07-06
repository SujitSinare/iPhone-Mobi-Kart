import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { Product } from './schemas/product.schema';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto, adminId: string): Promise<Product> {
    const productData = {
      ...createProductDto,
      createdBy: new Types.ObjectId(adminId) as any,
    };
    return this.productsRepository.create(productData);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findById(id);
    return this.productsRepository.update(id, updateProductDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.productsRepository.delete(id);
  }

  async findAll(getProductsDto: GetProductsDto) {
    const {
      search,
      brand,
      category,
      color,
      storage,
      minPrice,
      maxPrice,
      isAvailable,
      page,
      limit,
      sortBy,
      sortOrder,
    } = getProductsDto;

    const filterQuery: any = {};

    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (brand) {
      filterQuery.brand = { $regex: `^${brand}$`, $options: 'i' };
    }

    if (category) {
      filterQuery.category = { $regex: `^${category}$`, $options: 'i' };
    }

    if (color) {
      filterQuery.color = { $regex: `^${color}$`, $options: 'i' };
    }

    if (storage) {
      filterQuery.storage = { $regex: `^${storage}$`, $options: 'i' };
    }

    if (isAvailable !== undefined) {
      filterQuery.isAvailable = isAvailable;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filterQuery.price = {};
      if (minPrice !== undefined) {
        filterQuery.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filterQuery.price.$lte = maxPrice;
      }
    }

    return this.productsRepository.findWithPagination(
      filterQuery,
      page,
      limit,
      sortBy,
      sortOrder
    );
  }
}
