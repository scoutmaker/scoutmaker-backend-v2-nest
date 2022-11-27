import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { ApiPaginatedResponseDto } from './api-paginated-response.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  const reference = getSchemaPath(model);

  const data = {
    type: 'array',
    items: { $ref: reference },
  };

  return applyDecorators(
    ApiExtraModels(model, ApiPaginatedResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiPaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  totalDocs: {
                    type: 'number',
                  },
                  limit: {
                    type: 'number',
                  },
                  page: {
                    type: 'number',
                  },
                  totalPages: {
                    type: 'number',
                  },
                  hasPrevPage: {
                    type: 'boolean',
                  },
                  hasNextPage: {
                    type: 'boolean',
                  },
                  prevPage: {
                    type: 'number',
                    nullable: true,
                  },
                  nextPage: {
                    type: 'number',
                    nullable: true,
                  },
                  docs: data,
                },
              },
            },
          },
        ],
      },
    }),
  );
};
