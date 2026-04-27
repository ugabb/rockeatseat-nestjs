import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // Na versão 7, PRECISAMOS usar adapters!
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      log: ["warn", "error"],
    });
  }
  async onModuleInit() {
    // Conecta com o banco quando o módulo iniciar
    await this.$connect();
  }
  async onModuleDestroy() {
    // Desconecta com o banco quando o módulo for destruído
    await this.$disconnect();
  }
}
