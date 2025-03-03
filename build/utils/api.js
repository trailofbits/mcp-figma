import axios from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
export const BASE_URL = 'https://api.figma.com/v1';
export class FigmaApi {
    constructor(authManager) {
        this.authManager = authManager;
    }
    async makeRequest(path, method = 'GET', data) {
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
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const figmaError = error.response?.data;
                throw new McpError(ErrorCode.InternalError, `Figma API error: ${figmaError?.err ?? figmaError?.message ?? error.message}`);
            }
            throw error;
        }
    }
    buildQueryString(params) {
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
