import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { TokenInfo } from '../types/common.js';
import { ConfigManager } from './config.js';

export class AuthManager {
  private tokenInfo: TokenInfo | null = null;
  private apiKey: string | null = null;
  private configManager: ConfigManager;

  constructor() {
    this.configManager = new ConfigManager();
    
    // 从配置中加载API key
    const savedApiKey = this.configManager.getApiKey();
    if (savedApiKey) {
      this.setApiKey(savedApiKey);
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    // 保存到配置文件
    this.configManager.setApiKey(apiKey);
    
    // 由于Figma个人访问令牌不会过期，我们设置一个很远的过期日期
    this.tokenInfo = {
      accessToken: apiKey,
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1年后
    };
  }

  async getAccessToken(): Promise<string> {
    // 检查我们是否有有效的令牌
    if (this.tokenInfo && Date.now() < this.tokenInfo.expiresAt) {
      return this.tokenInfo.accessToken;
    }

    // 如果没有设置API key，尝试从配置中重新加载
    if (!this.apiKey) {
      const savedApiKey = this.configManager.getApiKey();
      if (savedApiKey) {
        this.setApiKey(savedApiKey);
        return savedApiKey;
      }
      
      throw new McpError(
        ErrorCode.InvalidParams,
        'No Figma API key provided. Use the set_api_key tool first.'
      );
    }

    // 返回API key作为令牌
    return this.apiKey;
  }
}