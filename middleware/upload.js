const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File size limits by type (in bytes)
const FILE_SIZE_LIMITS = {
  pdf: 50 * 1024 * 1024,      // 50MB for PDFs
  image: 10 * 1024 * 1024,    // 10MB for images
  video: 100 * 1024 * 1024    // 100MB for videos
};

// Allowed MIME types with file extensions
const ALLOWED_MIME_TYPES = {
  // PDF documents
  'application/pdf': { type: 'pdf', ext: '.pdf' },
  
  // Images
  'image/jpeg': { type: 'image', ext: '.jpg' },
  'image/png': { type: 'image', ext: '.png' },
  'image/gif': { type: 'image', ext: '.gif' },
  'image/webp': { type: 'image', ext: '.webp' },
  
  // Videos
  'video/mp4': { type: 'video', ext: '.mp4' },
  'video/mpeg': { type: 'video', ext: '.mpeg' },
  'video/webm': { type: 'video', ext: '.webm' },
  'video/quicktime': { type: 'video', ext: '.mov' }
};

// Magic numbers for file type validation (first bytes of file)
const MAGIC_NUMBERS = {
  pdf: [Buffer.from('%PDF')],
  jpeg: [Buffer.from([0xFF, 0xD8, 0xFF])],
  png: [Buffer.from([0x89, 0x50, 0x4E, 0x47])],
  gif: [Buffer.from('GIF87a'), Buffer.from('GIF89a')],
  webp: [Buffer.from('RIFF'), Buffer.from('WEBP')],
  mp4: [Buffer.from([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70])]
};

// Validate file magic numbers
const validateMagicNumber = (buffer, fileType) => {
  const magicNumbers = MAGIC_NUMBERS[fileType];
  if (!magicNumbers) return true; // Skip if no magic number defined
  
  return magicNumbers.some(magic => {
    const len = Math.min(magic.length, buffer.length);
    return buffer.slice(0, len).equals(magic.slice(0, len));
  });
};

// File filter function with enhanced validation
const fileFilter = (req, file, cb) => {
  const allowedFile = ALLOWED_MIME_TYPES[file.mimetype];
  
  if (!allowedFile) {
    return cb(new Error(`File type ${file.mimetype} is not allowed. Allowed: PDF, JPEG, PNG, GIF, WebP, MP4, MPEG, WebM`), false);
  }
  
  // Check file extension matches MIME type
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== allowedFile.ext && ext !== '.' + allowedFile.ext) {
    return cb(new Error('File extension does not match MIME type'), false);
  }
  
  // Store file type for size validation
  req.fileType = allowedFile.type;
  
  cb(null, true);
};

// Enhanced file filter with magic number validation
const fileFilterWithMagicNumber = async (req, file, cb) => {
  try {
    const allowedFile = ALLOWED_MIME_TYPES[file.mimetype];
    
    if (!allowedFile) {
      return cb(new Error(`File type ${file.mimetype} is not allowed. Allowed: PDF, JPEG, PNG, GIF, WebP, MP4, MPEG, WebM`), false);
    }
    
    // Check file extension matches MIME type
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== allowedFile.ext && ext !== '.' + allowedFile.ext) {
      return cb(new Error('File extension does not match MIME type'), false);
    }
    
    // Store file type for size validation
    req.fileType = allowedFile.type;
    
    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max (will be validated per type)
    files: 10 // Max 10 files
  },
  fileFilter: fileFilter
});

// Enhanced upload with magic number validation middleware
const validateFileUpload = (req, res, next) => {
  if (!req.file) return next();
  
  const fileType = req.fileType;
  const fileSize = req.file.size;
  
  // Check file size limit for specific type
  if (fileType && FILE_SIZE_LIMITS[fileType]) {
    if (fileSize > FILE_SIZE_LIMITS[fileType]) {
      return res.status(400).json({
        success: false,
        message: `${fileType.toUpperCase()} file size (${(fileSize / 1024 / 1024).toFixed(2)}MB) exceeds limit of ${(FILE_SIZE_LIMITS[fileType] / 1024 / 1024).toFixed(0)}MB`
      });
    }
  }
  
  // Validate magic number for PDFs and images
  if (fileType === 'pdf' || fileType === 'image') {
    if (!validateMagicNumber(req.file.buffer, fileType === 'pdf' ? 'pdf' : fileType)) {
      return res.status(400).json({
        success: false,
        message: 'File content does not match claimed file type'
      });
    }
  }
  
  next();
};

// Generate secure filename
const generateSecureFilename = (originalname) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalname).toLowerCase();
  const basename = path.basename(originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
  return `${basename}-${timestamp}-${randomString}${ext}`;
};

module.exports = {
  // Single file upload
  singleFile: upload.single('file'),
  
  // Multiple files upload
  multipleFiles: upload.array('files', 10),
  
  // Specific field upload
  uploadSingle: (fieldName) => upload.single(fieldName),
  
  // Validation middleware
  validateFileUpload,
  
  // Helper functions
  generateSecureFilename,
  FILE_SIZE_LIMITS
};
