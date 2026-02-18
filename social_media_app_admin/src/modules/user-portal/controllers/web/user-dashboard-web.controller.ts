import { Get, Controller, UseGuards, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('user')
export class UserDashboardController {
    @Get('dashboard')
    @UseGuards(AuthGuard)
    async getHomePage(@Req() req: Request, @Res() res: Response) {
        // Get analytics data
        //const analytics = await this.adminService.getAnalytics();

        return res.render('pages/user/index', {
            layout: 'layouts/user-layout',
            title: 'Dashboard',
            page_title: 'Dashboard',
            folder: 'Dashboard',
        });
    }
}
