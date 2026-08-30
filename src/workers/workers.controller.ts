import { Controller, Get, Post, Body, Delete, Param, Patch, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('workers')
export class WorkersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.worker.findMany({ orderBy: { id: 'asc' } });
  }

  private validateWorkerData(data: any) {
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException('Worker name is required.');
    }
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
      throw new BadRequestException('Valid 11-digit Bangladeshi phone number is required.');
    }
    if (!data.porishod || data.porishod.trim() === '') {
      throw new BadRequestException('Porishod is required.');
    }
  }

  @Post()
  async create(@Body() data: any) {
    this.validateWorkerData(data);
    return this.prisma.worker.create({ data });
  }

  @Post('bulk')
  async createBulk(@Body() data: any[]) {
    data.forEach(worker => this.validateWorkerData(worker));
    return this.prisma.worker.createMany({ data });
  }

  @Delete('all')
  async removeAll() {
    return this.prisma.worker.deleteMany({});
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.worker.delete({ where: { id: Number(id) } });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    this.validateWorkerData(data);
    return this.prisma.worker.update({ where: { id: Number(id) }, data });
  }
}
