import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminService } from '../../admin.services';

@Controller('admin')
export class AdminDashboardController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getHomePage(@Req() req: Request, @Res() res: Response) {
    // Get analytics data
    const analytics = await this.adminService.getAnalytics();

    return res.render('pages/admin/index', {
      title: 'Dashboard',
      page_title: 'Dashboard',
      folder: 'Dashboard',
      analytics,
    });
  }

}
