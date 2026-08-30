import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import axios from 'axios';
import FormData = require('form-data');
import 'multer';

@Controller('gallery')
export class GalleryController {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!this.botToken || !this.chatId) {
      return { error: "Telegram config missing in .env" };
    }

    try {
      const formData = new FormData();
      formData.append('chat_id', this.chatId);
      formData.append('photo', file.buffer, file.originalname);

      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendPhoto`,
        formData,
        { headers: formData.getHeaders() }
      );

      // টেলিগ্রাম থেকে অনেকগুলো সাইজের ছবি দেয়, আমরা সবচেয়ে বড়টা নিব
      const photoArray = response.data.result.photo;
      const bestPhoto = photoArray[photoArray.length - 1];
      const fileId = bestPhoto.file_id;

      return { success: true, file_id: fileId };
    } catch (error) {
      console.error("Telegram Upload Error:", error);
      return { error: "Failed to upload image to Telegram." };
    }
  }

  @Get('image/:file_id')
  async getImage(@Param('file_id') fileId: string, @Res() res: Response) {
    if (!this.botToken) return res.status(500).send("Config missing");

    try {
      // ১. File ID থেকে File Path বের করা
      const fileRes = await axios.get(`https://api.telegram.org/bot${this.botToken}/getFile?file_id=${fileId}`);
      const filePath = fileRes.data.result.file_path;

      // ২. File Path থেকে মূল ছবি ডাউনলোড করা
      const imageRes = await axios.get(`https://api.telegram.org/file/bot${this.botToken}/${filePath}`, {
        responseType: 'stream',
      });

      // ৩. ছবি ফ্রন্টএন্ডে স্ট্রিম করা (Proxy)
      res.set('Content-Type', 'image/jpeg');
      imageRes.data.pipe(res);
    } catch (error) {
      console.error("Fetch Image Error:", error);
      res.status(404).send("Image not found");
    }
  }
}
