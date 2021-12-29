import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponseDto } from './api-response.dto';

type Options = {
  isArray: boolean;
};

export const ApiResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: Options,
) => {
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
    ApiOkResponse({
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
