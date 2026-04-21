const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Force HTTPS
});

// Helper function to upload file to Cloudinary with enhanced security
const uploadToCloudinary = (fileBuffer, options = {}) => {
  const {
    folder = 'resources',
    resourceType = 'auto',
    allowedFormats = ['pdf', 'jpg', 'png', 'gif', 'webp', 'mp4', 'webm'],
    maxFileSize = 100 * 1024 * 1024 // 100MB
  } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        allowed_formats: allowedFormats,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        // Security: prevent execution of uploaded files
        flags: 'attachment',
        // Optimize delivery
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          reject(new Error('File upload failed'));
        } else {
          logger.info('File uploaded to Cloudinary:', {
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes
          });
          resolve(result);
        }
      }
    );
    
    // Convert buffer to stream
    const Readable = require('stream').Readable;
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info('File deleted from Cloudinary:', { publicId, result });
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from storage');
  }
};

// Helper function to generate secure URL
const getSecureUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    ...options
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  getSecureUrl
};
