export declare class ConfigManager {
    private configPath;
    private config;
    constructor();
    private loadConfig;
    saveConfig(): void;
    getApiKey(): string | undefined;
    setApiKey(apiKey: string): void;
}
