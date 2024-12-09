const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        cb(null, './uploads');
    },
    filename: (req:any, file:any, cb:any) => {
        // Use a unique filename with original file extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
export const upload = multer({ storage: storage });