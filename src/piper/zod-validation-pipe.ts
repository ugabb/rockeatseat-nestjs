import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      console.log("value", value);
      const parsedValue = this.schema.parse(value);
      console.log("parsed", parsedValue);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          errors: fromZodError(error),
        });
      }
    }
  }
}
