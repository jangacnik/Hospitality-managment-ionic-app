export class JwtModel {
  token: string;
  refreshToken: string;

  constructor(jwt: string, refresh: string) {
    this.token = jwt;
    this.refreshToken = refresh;
  }
}
