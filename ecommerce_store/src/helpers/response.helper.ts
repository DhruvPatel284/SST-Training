import { ApiResponse } from '../interfaces/api-response.interface';

export class ResponseHelper {
  static success<T>(
    message: string,
    payload?: T,
  ): ApiResponse<T> {
    return {
      status: 'success',
      message,
      payload,
    };
  }

  static error(
    message: string,
    errorDetails?: any,
    errorCode?: string,
  ): ApiResponse {
    return {
      status: 'error',
      message,
      error: {
        code: errorCode,
        details: errorDetails,
      },
    };
  }
}