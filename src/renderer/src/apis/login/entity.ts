export interface OwnerLoginRequest {
  account: string;
  password: string;
}

export interface OwnerLoginResponse {
  token: string;
  refresh_token: string;
}
