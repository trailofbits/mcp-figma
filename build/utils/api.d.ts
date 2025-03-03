import { AuthManager } from './auth.js';
export declare const BASE_URL = "https://api.figma.com/v1";
export declare class FigmaApi {
    private authManager;
    constructor(authManager: AuthManager);
    makeRequest<T>(path: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T>;
    buildQueryString(params: Record<string, string | number | boolean | undefined>): string;
}
