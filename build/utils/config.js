import fs from 'fs';
import path from 'path';
import os from 'os';
export class ConfigManager {
    constructor() {
        // 创建配置目录在用户目录下
        const configDir = path.join(os.homedir(), '.mcp-figma');
        this.configPath = path.join(configDir, 'config.json');
        this.config = { apiKey: undefined };
        // 确保目录存在
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        // 加载配置
        this.loadConfig();
    }
    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const fileContent = fs.readFileSync(this.configPath, 'utf-8');
                this.config = JSON.parse(fileContent);
            }
        }
        catch (error) {
            console.error('Failed to load config:', error);
            // 出错时使用默认配置
            this.config = { apiKey: undefined };
        }
    }
    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        }
        catch (error) {
            console.error('Failed to save config:', error);
        }
    }
    getApiKey() {
        return this.config.apiKey;
    }
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
        this.saveConfig();
    }
}
