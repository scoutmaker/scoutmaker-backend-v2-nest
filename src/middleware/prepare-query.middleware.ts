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
      sortBy: (sortBy as string) || DEFAULT_SORT,
      sortingOrder: (sortingOrder as 'asc' | 'desc') || DEFAULT_ORDER,
      limit: parseInt(limit as string) || DEFAULT_LIMIT,
      page: parseInt(page as string) || DEFAULT_PAGE,
    };
    next();
  }
}
