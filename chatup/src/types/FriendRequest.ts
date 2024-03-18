export interface FriendRequestResponse {
  id?: number;
  title?: string;
  image?: string;
  timestamp?: number;
  receiverId?: number;
  senderId?: number;
  status?: "PENDING" | "ACCEPTED" | "DECLINED";
  seen?: boolean;

}
export type FriendRequestsResponse = {
  data: FriendRequestResponse[];
  total: number;
};
