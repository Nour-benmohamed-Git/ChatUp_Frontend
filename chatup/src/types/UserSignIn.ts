export interface UserSignInRequest {
  email: string;
  password: string;
}
export interface UserSignInResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: 0 | 1 | 2;
  profileInfo: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}
