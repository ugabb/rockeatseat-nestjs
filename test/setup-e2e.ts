import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "generated/prisma/client";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseUrl;

  execSync("pnpm prisma migrate deploy");
});

afterAll(async () => {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
