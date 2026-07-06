import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { ProductsRepository } from '../products/products.repository';
import { OrdersRepository } from '../orders/orders.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly ordersRepository: OrdersRepository
  ) {}

  async getAdminStats(lowStockThreshold = 10) {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.productsRepository.count(),
      this.ordersRepository.count(),
      this.ordersRepository.sumRevenue(),
      this.ordersRepository.findRecent(5),
      this.productsRepository.findLowStock(lowStockThreshold),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      recentOrders,
      lowStockProducts,
    };
  }
}
