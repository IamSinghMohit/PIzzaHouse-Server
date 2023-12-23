import multer from "multer";

const storage = multer.memoryStorage(); // Use in-memory storage for uploading to Cloudinary
export default multer({ storage: storage });