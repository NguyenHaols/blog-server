import { IApiResponse } from 'src/common/interfaces/api-response.interface';

export class ApiResponse<T> implements IApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;

  constructor(data: T, message = 'Success', success = true, statusCode = 200) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.statusCode = statusCode;
  }

  static success<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
  ): ApiResponse<T> {
    return new ApiResponse(data, message, true, statusCode);
  }

  static error<T>(message: string, statusCode = 400): ApiResponse<T> {
    return new ApiResponse(null as unknown as T, message, false, statusCode);
  }
}
