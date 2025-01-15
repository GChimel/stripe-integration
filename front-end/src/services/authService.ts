import { httpClient } from "./httpClient";

interface ISignUpDTO {
  name: string;
  email: string;
  password: string;
}

interface ISignInDTO {
  email: string;
  password: string;
}

interface ISignInResponse {
  token: string;
  refreshToken: string;
}

export class AuthService {
  static async signUp({ name, email, password }: ISignUpDTO) {
    const { data } = await httpClient.post("/user", {
      name,
      email,
      password,
    });

    return data;
  }

  static async signIn({ email, password }: ISignInDTO) {
    const { data } = await httpClient.post<ISignInResponse>("/session", {
      email,
      password,
    });

    return data;
  }

  static async refreshToken(refreshToken: string) {
    const { data } = await httpClient.post<ISignInResponse>(
      "/session/refresh",
      {
        refreshToken,
      }
    );

    return data;
  }
}
