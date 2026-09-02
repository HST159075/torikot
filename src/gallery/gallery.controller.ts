import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import 'multer';

// Cloudinary কনফিগার করা
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('gallery')
export class GalleryController {

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return { error: "Cloudinary config missing in .env" };
    }

    try {
      // Buffer থেকে Stream বানিয়ে Cloudinary তে আপলোড করা
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'darbar-workers',
            resource_type: 'image',
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'face' },
              { quality: 'auto', fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      // Cloudinary থেকে public URL রিটার্ন করা
      return { success: true, file_id: result.secure_url };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return { error: "Failed to upload image to Cloudinary." };
    }
  }
}