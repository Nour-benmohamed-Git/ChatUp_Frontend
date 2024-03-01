import { UsersResponse } from "@/types/User";

export interface ConversationLauncherProps {
  label: string;
  togglePanel: (event?: React.MouseEvent) => void;
  initialUsers: UsersResponse;
}
