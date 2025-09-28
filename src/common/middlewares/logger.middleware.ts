import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: (error?: Error | any) => void) {
    const id = randomUUID();
    this.logger.debug(`${id} ${req.method}: ${req.originalUrl}`);
    res.on('finish', () => {
      this.logger.log(`${id}: ${res.statusCode}`);
    });
    next();
  }
}
