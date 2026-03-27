import { GlobalException } from './global-exception';
import { NextResponse } from 'next/server';
import { ApiResponseFactory } from '../dtos/api-response-factory';
import { ZodError } from 'zod';

export class ExceptionHandler {
  static async handle(error: unknown) {
    console.error('[ExceptionHandler] Error caught:', error);

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        fieldErrors[field] = err.message;
      });
      return NextResponse.json(
        await ApiResponseFactory.error('Validation Error', fieldErrors),
        { status: 422 }
      );
    }

    if (error instanceof GlobalException) {
      return NextResponse.json(
        await ApiResponseFactory.error(error.message),
        { status: error.statusCode }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        await ApiResponseFactory.error(error.message),
        { status: 500 }
      );
    }

    return NextResponse.json(
      await ApiResponseFactory.error('An unexpected error occurred'),
      { status: 500 }
    );
  }
}
