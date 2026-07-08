import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  brand: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, trim: true })
  phoneModel: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  color: string;

  @Prop({ required: true, trim: true })
  storage: string;

  @Prop({ required: true, trim: true })
  image: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Setup indices for search, sorting, and listing performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isAvailable: 1 });
ProductSchema.index({ createdAt: -1 });

// Text index for search functionality
ProductSchema.index({
  name: 'text',
  brand: 'text',
  phoneModel: 'text',
  description: 'text',
});
