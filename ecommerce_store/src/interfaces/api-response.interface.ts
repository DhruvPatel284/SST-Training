export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  payload?: T;
  error?: {
    code?: string;
    details?: any;
  };
}