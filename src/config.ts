import { z } from "zod";
export default function ValidateConfig() {
    const config = z.object({
        JWT_ACCESS_TOKEN_SECRET: z.string().nonempty(),
        JWT_REFRESH_TOKEN_SECRET: z.string().nonempty(),
        MONGODB_URL: z.string().nonempty(),
        GOOGLE_CLIENT_ID: z.string().nonempty(),
        GOOGLE_CLIENT_SECRET: z.string().nonempty(),
        REDIS_URL: z.string().nonempty(),
        FRONTEND_URL_CLIENT: z.string().nonempty(),
        FRONTEND_URL_ADMIN: z.string().nonempty(),
        STRIPE_SECRETKEY: z.string().nonempty(),
        STRIPE_PUBLISHABLE_KEY: z.string().nonempty(),
        STRIPE_WEBHOOK_SECRET: z.string().nonempty(),
        CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
        CLOUDINARY_API_SECRET: z.string().nonempty(),
        CLOUDINARY_KEY: z.string().nonempty(),
        CLOUDINARY_CATEGORY_FOLDER: z.string().nonempty(),
        CLOUDINARY_PRODUCT_FOLDER: z.string().nonempty(),
        CLOUDINARY_TOPING_FOLDER: z.string().nonempty(),
        CLOUDINARY_ORDER_FOLDER: z.string().nonempty(),
        CLOUDINARY_PLACEHOLDER_IMAGE_URL: z.string().nonempty(),
    });
    try {
        config.parse({
            JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
            JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
            MONGODB_URL: process.env.MONGODB_URL,
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            REDIS_URL: process.env.REDIS_URL,
            FRONTEND_URL_CLIENT: process.env.FRONTEND_URL_CLIENT,
            FRONTEND_URL_ADMIN: process.env.FRONTEND_URL_ADMIN,
            STRIPE_SECRETKEY: process.env.STRIPE_SECRETKEY,
            STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
            STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
            CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
            CLOUDINARY_CATEGORY_FOLDER: process.env.CLOUDINARY_CATEGORY_FOLDER,
            CLOUDINARY_PRODUCT_FOLDER: process.env.CLOUDINARY_PRODUCT_FOLDER,
            CLOUDINARY_TOPING_FOLDER: process.env.CLOUDINARY_TOPING_FOLDER,
            CLOUDINARY_ORDER_FOLDER: process.env.CLOUDINARY_ORDER_FOLDER,
            CLOUDINARY_PLACEHOLDER_IMAGE_URL:
                process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
        });
    } catch (error) {
        throw new Error(
            "validation failed, provide valid environment variables"
        );
    }
}
