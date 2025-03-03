export interface TokenInfo {
  accessToken: string;
  expiresAt: number;
}

export interface FigmaErrorResponse {
  status: number;
  err: string;
  message?: string;
}

export interface PaginationParams {
  page_size?: number;
  cursor?: string;
}

export interface BaseParams {
  ids?: string[];
  version?: string;
  depth?: number;
}