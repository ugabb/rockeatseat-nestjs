import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard.js";
import { CurrentUser } from "@/auth/current-user-decorator.js";
import { UserPayloadSchema } from "@/auth/jwt.strategy.js";
import z from "zod";
import { ZodValidationPipe } from "@/piper/zod-validation-pipe.js";
import { PrismaService } from "@/prisma/prisma.service.js";

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private db: PrismaService) {}

  @Post()
  async execute(
    @CurrentUser() user: UserPayloadSchema,
    @Body(new ZodValidationPipe(createQuestionSchema))
    body: CreateQuestionSchema,
  ) {
    const { title, content } = body;
    console.log("body", body);
    const userId = user.sub;
    const slug = this.convertTitleToSlug(title);

    const question = await this.db.questions.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    });

    return {
      question,
    };
  }

  private convertTitleToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}
