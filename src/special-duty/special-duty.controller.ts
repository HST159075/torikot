import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('special-duties')
export class SpecialDutyController {
  constructor(private readonly prisma: PrismaService) {}

  // শাখার সব ডিউটি আনা
  @Get(':branch')
  async findByBranch(@Param('branch') branch: string) {
    return this.prisma.specialDuty.findMany({
      where: { branch },
      orderBy: { createdAt: 'asc' },
    });
  }

  // নতুন ডিউটি যোগ করা
  @Post()
  async create(@Body() body: any) {
    return this.prisma.specialDuty.create({
      data: {
        branch: body.branch,
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        startDate: body.startDate || null,
        description: body.description || null,
        presentWorkers: body.presentWorkers ?? [],
        groups: body.groups ?? [],
      },
    });
  }

  // গ্রুপ ও কর্মী আপডেট করা
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    if (body.presentWorkers !== undefined) data.presentWorkers = body.presentWorkers;
    if (body.groups !== undefined) data.groups = body.groups;
    if (body.startDate !== undefined) data.startDate = body.startDate;
    if (body.description !== undefined) data.description = body.description;

    return this.prisma.specialDuty.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  // ডিউটি ডিলিট করা
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.prisma.specialDuty.delete({
      where: { id: parseInt(id) },
    });
  }
}
