import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import * as fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

// Ensure uploads directory exists for disk storage
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    };
  }

  @Post('cloudinary')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    }
  }))
  async uploadToCloudinary(@UploadedFile() file: Express.Multer.File) {
    console.log('[Cloudinary Upload] Request received. File:', file ? `${file.originalname} (${file.size} bytes, ${file.mimetype})` : 'NO FILE');
    console.log('[Cloudinary Upload] Buffer length:', file?.buffer?.length ?? 0);
    
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const hasSecret = !!process.env.CLOUDINARY_API_SECRET;
    console.log('[Cloudinary Upload] Config — cloud_name:', cloudName, '| api_key:', apiKey ? 'SET' : 'MISSING', '| api_secret:', hasSecret ? 'SET' : 'MISSING');

    if (!cloudName) {
      throw new BadRequestException('Cloudinary credentials are not configured in the server.');
    }

    // Configure Cloudinary dynamically so it picks up process.env correctly
    cloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profiles', resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload] ERROR:', error);
            return reject(new BadRequestException('Failed to upload file to Cloudinary: ' + error.message));
          }
          if (!result) return reject(new BadRequestException('Upload returned empty result'));
          console.log('[Cloudinary Upload] SUCCESS — secure_url:', result.secure_url);
          resolve({
            filename: result.public_id,
            path: result.secure_url,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: result.bytes
          });
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
