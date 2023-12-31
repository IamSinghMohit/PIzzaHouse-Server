declare namespace NodeJS {
    export interface ProcessEnv {
        JWT_ACCESS_TOKEN_SECRET: string;
        JWT_REFRESH_TOKEN_SECRET: string;
        MONGODB_URL: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        PORT: string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_SECRET: string;
        CLOUDINARY_CAEGORY_FOLDER: string;
        CLOUDINARY_PRODUCT_FOLDER: string;
        CLOUDINARY_TOPING_FOLDER: string;
        CLOUDINARY_KEY: string;
    }
}
