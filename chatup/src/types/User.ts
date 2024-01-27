export interface UserResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: 0 | 1 | 2;
  profileInfo: string;
}
export type UsersResponse = { data: UserResponse[] };
