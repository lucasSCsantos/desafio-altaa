import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './api-error';

export function createErrorResponse(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: err.issues[0]?.message || 'Erro de validação',
          // issues: err.issues.map((e) => ({
          //   path: e.path.join('.'),
          //   message: e.message,
          // })),
        },
      },
      { status: 400 },
    );
  }

  if (err instanceof ApiError) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: err.status },
    );
  }

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      },
    },
    { status: 500 },
  );
}
