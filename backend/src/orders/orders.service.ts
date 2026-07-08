import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderStatus, PaymentStatus } from './schemas/order.schema';
import { Role } from '../common/constants/role.enum';
import { Types } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService
  ) {}

  async placeOrder(userId: string, placeOrderDto: PlaceOrderDto): Promise<Order> {
    const { shippingAddress } = placeOrderDto;

    const cart = await this.cartService.getOrCreateCart(userId);
    if (!cart || cart.products.length === 0) {
      throw new BadRequestException('Checkout failed: Shopping cart is empty');
    }

    const orderItems: any[] = [];

    // Verify stock and check availability for all items first
    for (const item of cart.products) {
      const pId = item.productId && (item.productId as any)._id
        ? (item.productId as any)._id.toString()
        : item.productId.toString();
      const product = await this.productsService.findById(pId);

      if (!product.isAvailable) {
        throw new BadRequestException(`Checkout failed: Product "${product.name}" is no longer available`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Checkout failed: Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      const discountPercentage = product.discount || 0;
      const checkoutPrice = product.price - (product.price * discountPercentage) / 100;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: Number(checkoutPrice.toFixed(2)),
      });
    }

    // Deduct stock levels
    for (const item of cart.products) {
      const pId = item.productId && (item.productId as any)._id
        ? (item.productId as any)._id.toString()
        : item.productId.toString();
      const product = await this.productsService.findById(pId);
      const newStock = Math.max(0, product.stock - item.quantity);
      await this.productsService.update(pId, { stock: newStock } as any);
    }

    // Generate unique order number: ORD-YYYYMMDD-XXXXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.floor(100000 + Math.random() * 900000).toString();
    const orderNumber = `ORD-${dateStr}-${randStr}`;

    // Save order record
    const order = await this.ordersRepository.create({
      orderNumber,
      userId: new Types.ObjectId(userId) as any,
      items: orderItems,
      totalAmount: cart.total,
      shippingAddress,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
    });

    // Empty shopping cart
    await this.cartService.clearCart(userId);

    return order;
  }

  async cancelOrder(orderId: string, userId: string, userRole: string): Promise<Order> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const isAdmin = userRole === Role.ADMIN;
    // Safely extract the userId string (handling populated/unpopulated cases)
    const orderOwnerId = order.userId && typeof order.userId === 'object' && '_id' in order.userId
      ? (order.userId as any)._id.toString()
      : order.userId.toString();

    // Owner checks
    if (!isAdmin && orderOwnerId !== userId) {
      throw new ForbiddenException('Access denied: You do not own this order');
    }

    // Status checks
    if (!isAdmin && order.orderStatus !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Cancellation failed: Only pending orders can be cancelled. Current status is ${order.orderStatus}`
      );
    }

    if (isAdmin && (order.orderStatus === OrderStatus.DELIVERED || order.orderStatus === OrderStatus.CANCELLED)) {
      throw new BadRequestException(`Cancellation failed: Cannot cancel order with status ${order.orderStatus}`);
    }

    // Restore stock levels
    for (const item of order.items) {
      try {
        const pId = item.productId && (item.productId as any)._id
          ? (item.productId as any)._id.toString()
          : item.productId.toString();
        const product = await this.productsService.findById(pId);
        const newStock = product.stock + item.quantity;
        await this.productsService.update(pId, { stock: newStock } as any);
      } catch (e) {
        // If product was deleted since the order, skip gracefully
      }
    }

    return this.ordersRepository.update(orderId, { orderStatus: OrderStatus.CANCELLED });
  }

  async getOrderDetails(orderId: string, userId: string, userRole: string): Promise<Order> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const isAdmin = userRole === Role.ADMIN;
    const orderOwnerId = order.userId && typeof order.userId === 'object' && '_id' in order.userId
      ? (order.userId as any)._id.toString()
      : order.userId.toString();

    if (!isAdmin && orderOwnerId !== userId) {
      throw new ForbiddenException('Access denied: You do not have permission to view this order');
    }

    return order;
  }

  async getOrders(userId: string, userRole: string): Promise<Order[]> {
    if (userRole === Role.ADMIN) {
      return this.ordersRepository.findAll();
    }
    return this.ordersRepository.findByUserId(userId);
  }

  async updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const updateData: Partial<Order> = {};
    if (updateOrderStatusDto.orderStatus) {
      updateData.orderStatus = updateOrderStatusDto.orderStatus;
    }
    if (updateOrderStatusDto.paymentStatus) {
      updateData.paymentStatus = updateOrderStatusDto.paymentStatus;
    }

    return this.ordersRepository.update(orderId, updateData);
  }
}
