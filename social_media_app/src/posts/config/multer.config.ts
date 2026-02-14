import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

// Allowed file types
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 15 * 1024 * 1024; // 15 MB

// Storage configuration
export const multerPostMediaConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Store in public/uploads/posts directory
      const uploadPath = './public/uploads/posts';
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate unique filename: timestamp-randomstring-originalname
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    },
  }), 
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images') {
      // Validate image type
      if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
        return cb(
          new BadRequestException(
            `Invalid image format. Allowed formats: JPEG, PNG, GIF, WebP`,
          ),
          false,
        );
      }
    } else if (file.fieldname === 'videos') {
      // Validate video type
      if (!VIDEO_MIME_TYPES.includes(file.mimetype)) {
        return cb(
          new BadRequestException(
            `Invalid video format. Allowed formats: MP4, MPEG, QuickTime, AVI`,
          ),
          false,
        );
      }
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_VIDEO_SIZE, // Max size for any file (will be further validated per type)
  },
};

// Custom file size validator
export function validateFileSize(file: Express.Multer.File): void {
  if (file.fieldname === 'images' && file.size > MAX_IMAGE_SIZE) {
    throw new BadRequestException(
      `Image file ${file.originalname} exceeds 5 MB limit`,
    );
  }
  if (file.fieldname === 'videos' && file.size > MAX_VIDEO_SIZE) {
    throw new BadRequestException(
      `Video file ${file.originalname} exceeds 15 MB limit`,
    );
  }
}