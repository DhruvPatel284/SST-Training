import { Get, Controller } from '@nestjs/common';

@Controller('user')
export class UserDashboardController {
    @Get('/dashboard')
    hello(){
        console.log("hello")
        return "hello"
    }
}
