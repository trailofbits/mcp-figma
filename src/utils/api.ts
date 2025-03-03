import axios from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { FigmaErrorResponse } from '../types/common.js';
import { AuthManager } from './auth.js';

export const BASE_URL = 'https://api.figma.com/v1';

export class FigmaApi {
  private authManager: AuthManager;

  constructor(authManager: AuthManager) {
    this.authManager = authManager;
  }

  async makeRequest<T>(
    path: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data?: any
  ): Promise<T> {
    try {
      const token = await this.authManager.getAccessToken();
      const response = await axios({
        method,
        url: `${BASE_URL}${path}`,
        headers: {
          'X-Figma-Token': token
        },
        data
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const figmaError = error.response?.data as FigmaErrorResponse;
        throw new McpError(
          ErrorCode.InternalError,
          `Figma API error: ${figmaError?.err ?? figmaError?.message ?? error.message}`
        );
      }
      throw error;
    }
  }

  buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const urlParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        urlParams.set(key, value.toString());
      }
    });

    const queryString = urlParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}