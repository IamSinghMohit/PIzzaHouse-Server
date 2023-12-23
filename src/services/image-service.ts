import cloudinary from "../helper/cloudinary";
import { Readable } from "stream";
import sharp from "sharp";
import {  UploadApiResponse } from "cloudinary";
import { Request } from "express";

class ImageService {
    static async compressImageToBuffer(req: Request) {
        let compressedImage = sharp(req.file?.buffer)
            .toFormat("webp")
            .webp({ quality: 85 });

        return await compressedImage.toBuffer();
    }

    static async uploadImageWithBuffer(
        foldername: string,
        processedImage: Buffer,
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const stream = new Readable();
            stream.push(processedImage);

            const upload = cloudinary.uploader.upload_stream(
                { folder: foldername },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        resolve(result);
                    }
                },
            );

            stream.pipe(upload);
            stream.push(null);
        });
    }

    static async deleteImage(id: string, cb: () => void) {
        await cloudinary.uploader.destroy(id, () => {
            cb();
        });
    }
}
export default ImageService;
