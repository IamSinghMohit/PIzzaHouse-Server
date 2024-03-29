declare namespace NodeJS {
    export interface ProcessEnv {
        JWT_ACCESS_TOKEN_SECRET: string;
        JWT_REFRESH_TOKEN_SECRET: string;
        MONGODB_URL: string;
        PAYMENT_SCCESS_URL: string;
        PAYMENT_FAILED_URL: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        FRONTEND_URL_CLIENT: string;
        FRONTEND_URL_ADMIN: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_PASSWORD: string;
        PORT: string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_SECRET: string;
        CLOUDINARY_CATEGORY_FOLDER: string;
        CLOUDINARY_PRODUCT_FOLDER: string;
        CLOUDINARY_TOPING_FOLDER: string;
        CLOUDINARY_ORDER_FOLDER: string;
        CLOUDINARY_KEY: string;
        CLOUDINARY_PLACEHOLDER_IMAGE_URL: string;
        STRIPE_SECRETKEY: string;
        STRIPE_PUBLISHABLE_KEY: string;
        STRIPE_WEBHOOK_SECRET: string;
    }
}
