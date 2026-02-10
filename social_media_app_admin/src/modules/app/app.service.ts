import { Injectable, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import databaseConfig from '../../common/config/database.config';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    console.log(this.configService);
    console.log('database Config file', databaseConfig);
    console.log('databaseConfig', this.configService.get('database.host'));

    return 'Hello World!';
  }
}
