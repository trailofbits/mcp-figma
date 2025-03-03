export declare class AuthManager {
    private tokenInfo;
    private apiKey;
    private configManager;
    constructor();
    setApiKey(apiKey: string): void;
    getAccessToken(): Promise<string>;
}
