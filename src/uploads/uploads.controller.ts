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
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      url: `/uploads/${file.filename}`,
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
    
    if (!file || !file.buffer) {
      throw new BadRequestException('Nenhum arquivo enviado ou arquivo corrompido.');
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    console.log(
      '[Cloudinary Upload] Config — cloud_name:',
      cloudName,
      '| api_key:',
      apiKey ? 'SET' : 'MISSING',
      '| api_secret:',
      apiSecret ? 'SET' : 'MISSING',
      '| cloudinary_url:',
      cloudinaryUrl ? 'SET' : 'MISSING'
    );

    if (!cloudName && !cloudinaryUrl) {
      throw new BadRequestException(
        'Cloudinary credentials are not configured in the server. Please set CLOUDINARY_CLOUD_NAME (or CLOUDINARY_NAME) and CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in Railway.'
      );
    }

    // Configure Cloudinary dynamically so it picks up process.env correctly
    if (cloudinaryUrl) {
      cloudinary.config({
        cloudinary_url: cloudinaryUrl,
      });
    } else {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profiles', resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload] ERROR:', error);
            return reject(
              new BadRequestException(
                'Falha ao enviar arquivo para o Cloudinary: ' +
                  (error.message || JSON.stringify(error))
              )
            );
          }
          if (!result) return reject(new BadRequestException('Upload retornou resultado vazio'));
          console.log('[Cloudinary Upload] SUCCESS — secure_url:', result.secure_url);
          resolve({
            filename: result.public_id,
            path: result.secure_url,
            url: result.secure_url,
            secure_url: result.secure_url,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: result.bytes
          });
        }
      );

      uploadStream.on('error', (streamErr) => {
        console.error('[Cloudinary Stream Error]:', streamErr);
        reject(
          new BadRequestException(
            'Erro no stream do Cloudinary: ' + (streamErr.message || 'Desconhecido')
          )
        );
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
