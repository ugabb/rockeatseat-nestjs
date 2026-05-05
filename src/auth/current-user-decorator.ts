import { createParamDecorator } from "@nestjs/common";
import { UserPayloadSchema } from "./jwt.strategy.js";

export const CurrentUser = createParamDecorator((_, context) => {
  const request = context.switchToHttp().getRequest();

  return request.user as UserPayloadSchema;
});
