import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

interface DocumentBase {
  authorId: string;
}

interface FeatureService {
  findOne?: (id: string) => Promise<DocumentBase>;
  findOneBySlug?: (slug: string) => Promise<DocumentBase>;
}

export const featureServiceName = 'FeatureService';

@Injectable()
export class AdminOrAuthorGuard implements CanActivate {
  constructor(
    private readonly i18n: I18nService,
    @Inject(featureServiceName) private readonly featureService: FeatureService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;
    const { id, slug } = request.params;

    // If user is an admin, they can do anything
    if (user.role === 'ADMIN') {
      return true;
    }

    // We have to fetch the document to determine if they are an author
    let document: DocumentBase | undefined;

    // If request.params.id value exists and findOne method exists, we want to call it
    if (id && this.featureService.findOne) {
      document = await this.featureService?.findOne(id);
    }

    // If request.params.slug value exists and findOneBySlug method exists, we want to call it
    if (slug && this.featureService.findOneBySlug) {
      document = await this.featureService?.findOneBySlug(slug);
    }

    // If user is an author of the document, we allow the operation
    if (user.id === document?.authorId) {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = await this.i18n.translate('common.ACCESS_ERROR', {
      lang,
      args: { method: request.method, param: id || slug },
    });

    throw new UnauthorizedException(message);
  }
}
