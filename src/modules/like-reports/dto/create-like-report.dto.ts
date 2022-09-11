import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateLikeReportDto {
  @IsCuid()
  reportId: string;
}
