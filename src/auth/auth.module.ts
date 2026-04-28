import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Env } from "src/env";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateSecret = config.get("JWT_PRIVATE_SECRET", { infer: true });
        const publicSecret = config.get("JWT_PUBLIC_SECRET", { infer: true });

        return {
          signOptions: { algorithm: "RS256" },
          privateKey: Buffer.from(privateSecret, "base64"),
          publicKey: Buffer.from(publicSecret, "base64"),
        };
      },
    }),
  ],
})
export class AuthModule {}
