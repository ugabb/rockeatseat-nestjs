import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "../piper/zod-validation-pipe.js";
import z from "zod";

const createAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

@Controller("/auth")
export class CreateAccountController {
  constructor(private db: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async execute(@Body() body: any) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.db.user.findUnique({
      where: { email },
    });
    if (userWithSameEmail) {
      throw new ConflictException("User with same email already exists");
    }

    const hashedPassword = await hash(password, 8);

    await this.db.user.create({
      data: { name, email, password: hashedPassword },
    });

    return { message: "User created successfully" };
  }
}
