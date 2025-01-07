declare namespace NodeJS {
    export interface ProcessEnv {
        CLIENT_TOKEN: string;
        CLIENT_ID: string;
        GUILD_ID: string;
        MONGOOSE_URI: string
        SGDB_APIKEY: string
    }
}