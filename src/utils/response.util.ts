export interface ApiSuccessResponse<T = any> {
  success: true;
  status: number;
  data: T;
  trace: string;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  message: string;
  trace: string;
  error?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export function createErrorResponse(
  status: number,
  message: string,
  trace: string,
  error?: string,
): ApiErrorResponse {
  return {
    success: false,
    status,
    message,
    trace,
    error,
  };
}
