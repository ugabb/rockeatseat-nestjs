import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service.js";
import { CreateAccountController } from "./controllers/create-account.controller.js";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
