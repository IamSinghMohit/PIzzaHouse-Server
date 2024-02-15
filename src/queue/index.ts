import { CategoryImageUploadQueueWorker } from "./categoryImageUpload.queue";
import { ProductImageQueueWorker } from "./productImageUPload.queue";
import { DeleteImaeQueueWorker } from "./deleteImage.queue";
import { TopingImageUploadQueueWorker } from "./topingImageUpload.queue";
import { OrderImageUploadQueue } from "./orderImageUpload.queue";
import { DeleteOrderQueue } from "./deleteOrderQueue";
import { OrderTopingImageUploadQueue } from "./orderTopingImageUpload.queue";

export {
    CategoryImageUploadQueueWorker,
    ProductImageQueueWorker,
    DeleteImaeQueueWorker,
    TopingImageUploadQueueWorker,
    DeleteOrderQueue,
    OrderImageUploadQueue,
    OrderTopingImageUploadQueue,
};
