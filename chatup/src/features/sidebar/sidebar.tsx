import { fetchConversations } from "@/app/_actions/conversation-actions/fetch-conversations";
import { fetchCurrentUser } from "@/app/_actions/user-actions/fetch-current-user";
import { fetchOwnFriends } from "@/app/_actions/user-actions/fetch-own-friends";
import SidebarContent from "../sidebar-content/sidebar-content";

const SideBar = async () => {
  const conversationsPromise = await fetchConversations(1, 10, "");
  const friendsPromise = await fetchOwnFriends(1, 10, "");
  const currentUserPromise = await fetchCurrentUser();

  const [conversations, friends, currentUser] = await Promise.all([
    conversationsPromise,
    friendsPromise,
    currentUserPromise,
  ]);
  return (
    <SidebarContent
      initialConversations={conversations}
      initialFriends={friends}
      currentUser={currentUser?.data}
    />
  );
};
export default SideBar;
