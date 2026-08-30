import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('committees')
export class CommitteesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.committee.findMany();
  }

  @Post()
  async create(@Body() data: any) {
    return this.prisma.committee.create({ data });
  }

  @Post('bulk')
  async createBulk(@Body() data: any[]) {
    return this.prisma.committee.createMany({ data });
  }

  @Delete('all')
  async removeAll() {
    return this.prisma.committee.deleteMany({});
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.committee.delete({ where: { id: Number(id) } });
  }
}
