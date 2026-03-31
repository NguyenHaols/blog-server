export interface IApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}
