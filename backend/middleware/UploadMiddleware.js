// middleware/UploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads dir exists
const UPLOAD_DIR = 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ---------- Storage ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ---------- File Filters ----------
// Only images
const imageOnlyFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowed.test(ext)) return cb(null, true);
  cb(new Error('Only image files are allowed'));
};

// Images + PDF for order customization
const imageOrPdfFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|pdf/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowed.test(ext)) return cb(null, true);
  cb(new Error('Only image or PDF files are allowed'));
};

// ---------- Multer instances ----------
// Product uploads (main image + gallery)
const productUpload = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'image', maxCount: 1 },  // main image
  { name: 'images', maxCount: 5 }, // gallery images
]);

// Order uploads (customization)
const orderUpload = multer({
  storage,
  fileFilter: imageOrPdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'customImage', maxCount: 1 }, // optional
  { name: 'customPdf', maxCount: 1 },   // optional
]);

module.exports = {
  uploadProduct: productUpload,
  uploadOrder: orderUpload,
};
