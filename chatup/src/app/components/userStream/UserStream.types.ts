export interface UserStreamProps {
  mediaStream: MediaStream | null;
  isVideoEnabled: boolean;
  isCurrentUser: boolean;
  profilePicture?: string;
  username?: string;
}
