import multer from "multer";

// Store files in memory temporarily before uploading to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;