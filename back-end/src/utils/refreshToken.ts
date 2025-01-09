import { JwtPayload, sign, verify } from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars";

export class GenerateRefreshToken {
  static genereate(userId: string) {
    return sign({ sub: userId }, ENV_VARS.REFRESH_TOKEN_SECRET as string, {
      expiresIn: "10d",
    });
  }

  static validate(token: string) {
    try {
      const payload = verify(
        token,
        ENV_VARS.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;

      return payload.sub;
    } catch (error) {
      return;
    }
  }
}
