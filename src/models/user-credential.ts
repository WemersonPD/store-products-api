export interface IAccessTokenAndRefreshToken  {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface IChangePin  {
  email: string | null;
  pin: string | null;
  recoveryToken: string | null;
}
