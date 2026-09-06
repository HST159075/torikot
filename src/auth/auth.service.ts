import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'darbar_jwt_secret_change_in_prod';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(branch: string, password: string) {
    if (!branch || !password) {
      throw new UnauthorizedException('শাখা নম্বর ও পাসওয়ার্ড দিন।');
    }

    const user = await this.prisma.user.findUnique({
      where: { branch: branch.trim().toUpperCase() },
    });

    if (!user) {
      throw new UnauthorizedException('শাখা নম্বর বা পাসওয়ার্ড সঠিক নয়।');
    }

    const isMatch = await bcrypt.compare(password.trim(), user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('শাখা নম্বর বা পাসওয়ার্ড সঠিক নয়।');
    }

    const token = jwt.sign(
      { userId: user.id, branch: user.branch, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    return { token, role: user.role, branch: user.branch };
  }

  async createUser(branch: string, password: string, role: 'admin' | 'member') {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        branch: branch.trim().toUpperCase(),
        passwordHash,
        role,
      },
    });
  }
}
