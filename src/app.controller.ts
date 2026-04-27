import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service.js";
import { PrismaService } from "./prisma/prisma.service.js";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private db: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/users")
  async fetchUsers() {
    return await this.db.user.findMany();
  }
}
