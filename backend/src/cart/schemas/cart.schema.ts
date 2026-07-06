import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  products: CartItem[];

  @Prop({ required: true, default: 0, min: 0 })
  quantity: number;

  @Prop({ required: true, default: 0, min: 0 })
  subtotal: number;

  @Prop({ required: true, default: 0, min: 0 })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Index carts by userId for fast retrieval and uniqueness enforcement
CartSchema.index({ userId: 1 }, { unique: true });
