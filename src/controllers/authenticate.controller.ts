import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { compare, hash } from "bcryptjs";
import { ZodValidationPipe } from "../piper/zod-validation-pipe.js";
import z from "zod";
import { JwtService } from "@nestjs/jwt";

const authenticateSchema = z.object({
  email: z.email(),
  password: z.string(),
});

@Controller("/sessions")
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private db: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async execute(@Body() body) {
    const { email, password } = body;

    const user = await this.db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException("User credentials are invalid");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("User credentials are invalid");
    }

    const token = this.jwt.sign({
      sub: user.id,
    });
    return {
      access_token: token,
    };
  }
}
