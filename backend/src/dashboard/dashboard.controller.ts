import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/role.enum';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @ApiOperation({ summary: 'Get administrator dashboard metrics (Admin only)' })
  @ApiQuery({
    name: 'threshold',
    required: false,
    type: Number,
    description: 'Stock level threshold to classify low stock items (default: 10)',
  })
  @ApiResponse({ status: 200, description: 'Dashboard metrics loaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized context' })
  @ApiResponse({ status: 403, description: 'Forbidden: Administrator privileges required' })
  async getAdminStats(@Query('threshold') threshold?: string) {
    const stockThreshold = threshold ? parseInt(threshold, 10) : 10;
    return this.dashboardService.getAdminStats(stockThreshold);
  }
}
