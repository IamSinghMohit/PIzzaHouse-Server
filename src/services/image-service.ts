import cloudinary from "../helper/cloudinary";
import { Readable } from "stream";
import sharp from "sharp";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Request } from "express";

class ImageService {
    static async compressImageToBuffer(req: Request) {
        console.log(req.file?.buffer);
        const compressedImage = sharp(req.file?.buffer)
            .resize({ width: 480, withoutEnlargement: true })
            .toFormat("webp")
            .webp({ quality: 80 });

        if (req.file) {
            req.file.buffer = null as unknown as Buffer;
        }
        return await compressedImage.toBuffer();
    }

    static async uploadImageWithBuffer(
        processedImage: Buffer,
        cb: (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
        ) => void
    ) {
        const stream = new Readable();
        stream.push(processedImage);

        const upload = cloudinary.uploader.upload_stream((error, result) =>
            cb(error, result)
        );

        stream.pipe(upload);
        stream.push(null);
    }

    static async deleteImage(id: string, cb: () => void) {
        await cloudinary.uploader.destroy(id, () => {
            cb();
        });
    }
}
export default ImageService;
