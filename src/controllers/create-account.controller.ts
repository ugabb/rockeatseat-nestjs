import { Body, ConflictException, Controller, Post } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("/auth")
export class CreateAccountController {
  constructor(private db: PrismaService) {}

  @Post()
  async execute(@Body() body: any) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.db.user.findUnique({
      where: { email },
    });
    if (userWithSameEmail) {
      throw new ConflictException("User with same email already exists");
    }

    await this.db.user.create({
      data: { name, email, password },
    });

    return { message: "User created successfully" };
  }
}
