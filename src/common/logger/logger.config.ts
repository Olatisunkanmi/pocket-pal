import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}] [${label}]: ${message}`;
});

@Injectable()
class AppLogger implements LoggerService {
  private logger: Logger;
  private options: any;

  constructor(private readonly cfg: ConfigService) {
    this.options = {
      file: {
        level: cfg.get('logLevel'),
        filename: `${cfg.get('appRoot')}/logs/${cfg.get(
          'NODE_ENV',
        )}-%DATE%-app.log`,
        json: true,
        maxsize: 5242880,
        colorize: true,
        datePattern: 'YYYY-MM-DD',
        handleExceptions: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: combine(
          format.splat(),
          format.json(),
          label({ label: cfg.get('appName') }),
          timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          logFormat,
        ),
      },
      console: {
        level: cfg.get('logLevel'),
        handleExceptions: true,
        exitOnError: false,
        json: false,
        colorize: true,
        format: combine(
          format.colorize(),
          format.splat(),
          label({ label: cfg.get('appName') }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          logFormat,
        ),
      },
    };

    this.logger = this.initLogger();
  }
  /**
   * @method initLogger
   */
  private initLogger() {
    return createLogger({
      transports: [
        new transports.Console(this.options.console),
        new DailyRotateFile(this.options.file),
      ],
    });
  }

  /**
   * @method log
   */
  public log(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.info(msg as string, { ...meta });
    }
    return this.logger.info(message, optionalParams);
  }

  /**
   * @method error
   */
  public error(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.error(msg as string, { ...meta });
    }
    return this.logger.error(message, optionalParams);
  }

  /**
   * @method warn
   */
  public warn(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.warn(msg as string, { ...meta });
    }
    return this.logger.warn(message, optionalParams);
  }

  /**
   * @method debug
   */
  public debug?(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.debug(msg as string, { ...meta });
    }
    return this.logger.debug(message, optionalParams);
  }

  /**
   * @method verbose
   */
  public verbose?(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.verbose(msg as string, { ...meta });
    }
    return this.logger.verbose(message, optionalParams);
  }

  /**
   * @method threat
   */
  public threat?(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.warn(msg as string, { ...meta });
    }
    return this.logger.warn(message, optionalParams);
  }
}

export default AppLogger;
