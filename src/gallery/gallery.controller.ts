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

  // ফাইলের extension থেকে সঠিক content-type বের করা
  // কারণ Telegram Bot API সবসময় 'application/octet-stream' রিটার্ন করে,
  // real content-type header দেয় না — এই কারণে <img src="data:..."> রেন্ডার হয় না
  private getContentTypeFromPath(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      default:
        return 'image/jpeg'; // fallback, Telegram photo prায় সবসময় jpg
    }
  }

  @Get('image/:file_id')
  async getImage(@Param('file_id') fileId: string, @Res() res: Response) {
    if (!this.botToken) return res.status(500).send("Config missing");

    try {
      // ১. File ID থেকে File Path বের করা
      const fileRes = await axios.get(
        `https://api.telegram.org/bot${this.botToken}/getFile?file_id=${fileId}`,
        { timeout: 10000 }
      );
      const filePath = fileRes.data.result.file_path;

      // ২. File Path থেকে মূল ছবি ডাউনলোড করা
      const imageRes = await axios.get(
        `https://api.telegram.org/file/bot${this.botToken}/${filePath}`,
        { responseType: 'stream', timeout: 15000 }
      );

      // ৩. Content-Type নির্ধারণ করা — Telegram হেডার ট্রাস্ট না করে
      // file_path-এর extension থেকে সঠিক image mime type বের করা হচ্ছে
      const contentType = this.getContentTypeFromPath(filePath);

      // ৪. Cache headers + CORS সহ ছবি পাঠানো
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // ১ দিন ক্যাশ
        'Access-Control-Allow-Origin': '*',
      });

      imageRes.data.pipe(res);
    } catch (error) {
      console.error("Fetch Image Error:", error);
      res.status(404).send("Image not found");
    }
  }
}