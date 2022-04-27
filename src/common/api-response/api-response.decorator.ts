import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from './api-response.dto';

type Options = {
  isArray?: boolean;
  type: 'create' | 'read' | 'update' | 'delete';
};

export const ApiResponse = <TModel extends Type<any>>(
  model: TModel,
  options: Options,
) => {
  const ResponseDecorator =
    options.type === 'create' ? ApiCreatedResponse : ApiOkResponse;
  const reference = getSchemaPath(model);

  const data = options?.isArray
    ? {
        type: 'array',
        items: { $ref: reference },
      }
    : {
        type: 'object',
        $ref: reference,
      };

  return applyDecorators(
    ApiExtraModels(model, ApiResponseDto),
    ResponseDecorator({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data,
            },
          },
        ],
      },
    }),
  );
};
