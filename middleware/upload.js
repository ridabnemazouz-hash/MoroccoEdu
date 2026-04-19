const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    // PDF documents
    'application/pdf': 'pdf',
    
    // Images
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/webp': 'image',
    
    // Videos
    'video/mp4': 'video',
    'video/mpeg': 'video',
    'video/webm': 'video',
    'video/quicktime': 'video'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: PDF, Images (JPEG, PNG, GIF, WebP), Videos (MP4, MPEG, WebM)`), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  },
  fileFilter: fileFilter
});

// Export different upload configurations
module.exports = {
  // Single file upload
  singleFile: upload.single('file'),
  
  // Multiple files upload
  multipleFiles: upload.array('files', 10),
  
  // Specific field upload
  uploadSingle: (fieldName) => upload.single(fieldName)
};
