export type JwtSignOptions = {
  secret: string;
  expiresIn: string;
};

export type JwtVerifyOptions = {
  secret: string;
};

export abstract class IJwtService {
  abstract sign(payload: Record<string, any>, options: JwtSignOptions): string;
  abstract verify<T = unknown>(
    token: string,
    options: JwtVerifyOptions,
  ): T | null;
}
