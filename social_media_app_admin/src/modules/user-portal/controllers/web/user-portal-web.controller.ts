import { Get, Controller } from '@nestjs/common';

@Controller('user')
export class UserPortalController {
    @Get()
    hello(){
        console.log("hello")
        return "hello"
    }
}
