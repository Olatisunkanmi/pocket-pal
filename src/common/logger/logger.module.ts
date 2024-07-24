import { Global, Module } from '@nestjs/common';
import Logger from './logger.config';

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
