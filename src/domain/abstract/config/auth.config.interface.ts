export abstract class IAuthConfig {
  refreshSecret: string;
  refreshExpiresIn: string;
  accessSecret: string;
  accessExpiresIn: string;
}
