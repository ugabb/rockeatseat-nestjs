import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service.js";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard.js";
import z from "zod";
import { ZodValidationPipe } from "@/piper/zod-validation-pipe.js";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidatinoPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(private db: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async execute(
    @Query("page", queryValidatinoPipe) page: PageQueryParamSchema,
  ) {
    const perPage = 10;
    const questions = await this.db.questions.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: "desc" },
    });

    return { questions };
  }
}
