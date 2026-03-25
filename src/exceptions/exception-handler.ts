import { GlobalException } from './global-exception';
import { NextResponse } from 'next/server';
import { ApiResponseFactory } from '../dtos/api-response-factory';

export class ExceptionHandler {
  static async handle(error: unknown) {
    console.error('[ExceptionHandler] Error caught:', error);

    if (error instanceof GlobalException) {
      return NextResponse.json(
        await ApiResponseFactory.error(error.message, ),
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

