export interface ILoginDto {
  userId: string;
  password: string;
}

export interface ILoginErrorDto {
  isError: boolean;
  errorMsg: string;
}
