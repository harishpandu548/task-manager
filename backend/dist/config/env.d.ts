export declare const env: {
    readonly nodeEnv: "development" | "test" | "production";
    readonly port: number;
    readonly databaseUrl: string;
    readonly frontendUrl: string;
    readonly redisUrl: string;
    readonly jwt: {
        readonly accessSecret: string;
        readonly refreshSecret: string;
        readonly accessExpiry: string;
        readonly refreshExpiry: string;
    };
    readonly cookie: {
        readonly domain: string | undefined;
        readonly secure: boolean;
    };
    readonly logLevel: string;
    readonly rateLimit: {
        readonly windowMs: number;
        readonly max: number;
    };
};
export type Env = typeof env;
//# sourceMappingURL=env.d.ts.map