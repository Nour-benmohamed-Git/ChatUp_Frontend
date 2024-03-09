export interface NotificationResponse {
  id?: number;
  title?: string;
  image?: string;
  timestamp?: number;
  receiverId?: number;
  senderId?: number;
  status?: "PENDING" | "ACCEPTED" | "DECLINED";
}
export type NotificationsResponse = {
  data: NotificationResponse[];
  total: number;
};
