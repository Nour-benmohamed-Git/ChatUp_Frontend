export interface UserResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: 0 | 1 | 2;
  profileInfo: string;
  profilePicture?: string;
}
export type UsersResponse = { data: UserResponse[]; total: number };
export interface UserUpdateResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: 0 | 1 | 2;
  profileInfo?: string;
  profilePicture?: string;
}
export interface UserUpdateRequest {
  email: string;
  username: string;
  phone: string;
  profileInfo: string;
  profilePicture?: File | null | string;
}
