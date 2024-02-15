export enum QueueEnum {
    ORDER_IMAGE_UPLOAD_QUEUE = "order-image-upload-queue",
    CATEGORY_IMAGE_UPLOAD_QUEUE = "image-upload-queue",
    PRODUCT_IMAGE_UPLOAD_QUEUE = "product-image-upload-queue",
    TOPING_IMAGE_UPLOAD_QUEUE = "toping-image-upload-queue",
    DELETE_IMAGE_QUEUE = "delete-image-queue",
    DELETE_ORDER_QUEUE = "delete-order-queue",
    ORDER_TOPING_IMAGE_UPLOAD_QUEUE = "order-toping-image-upload-queue",
    DELETE_ORDER_TOPING_QUEUE = "delete-order-toping-queue",
}
export type TRedisBufferKey = `${string}Id:${string}:buffer`;
