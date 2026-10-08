import { Module } from '@nestjs/common';
import { SpecialDutyController } from './special-duty.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialDutyController],
})
export class SpecialDutyModule {}
