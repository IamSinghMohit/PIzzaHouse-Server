import cloudinary from "../helper/cloudinary";
import { Readable } from "stream";
import sharp from "sharp";
import { UploadApiResponse } from "cloudinary";
import { Request } from "express";
import { resolve } from "path";

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
                    } else {
                        reject(new Error("Error while uploading image"));
                    }
                },
            );

            stream.pipe(upload);
            stream.push(null);
        });
    }

    static async deleteImage(id: string) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(id, (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve(result);
                } else {
                    reject(new Error("Error while uploading image"));
                }
            });
        });
    }
}
export default ImageService;
