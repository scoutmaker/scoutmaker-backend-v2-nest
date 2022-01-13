import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  DEFAULT_ORDER,
} from '../utils/constants';

@Injectable()
export class PrepareQueryMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { sortBy, sortingOrder, limit, page, ...rest } = req.query;

    req.query = rest;
    req.paginationOptions = {
      sortBy: typeof sortBy === 'string' ? sortBy : DEFAULT_SORT,
      sortingOrder:
        typeof sortingOrder === 'string' ? sortingOrder : DEFAULT_ORDER,
      limit:
        typeof limit !== 'undefined'
          ? parseInt(limit as string)
          : DEFAULT_LIMIT,
      page:
        typeof page !== 'undefined' ? parseInt(page as string) : DEFAULT_PAGE,
    };

    next();
  }
}
