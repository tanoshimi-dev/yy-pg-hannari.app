import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

interface GoogleUserData {
  googleId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userData: GoogleUserData): Promise<User> {
    let user = await this.prisma.user.findUnique({
      where: { googleId: userData.googleId },
    });

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: userData.email,
          displayName: userData.displayName,
          avatarUrl: userData.avatarUrl,
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          googleId: userData.googleId,
          email: userData.email,
          displayName: userData.displayName,
          avatarUrl: userData.avatarUrl,
        },
      });
    }

    return user;
  }

  login(user: User): { accessToken: string } {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
