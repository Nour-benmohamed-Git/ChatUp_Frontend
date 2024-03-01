import ConversationList from "@/features/conversation-list/conversation-list";
import { fetchConversations } from "../_actions/fetch-conversations";
import { fetchCurrentUser } from "../_actions/fetch-current-user";
import { fetchUsers } from "../_actions/fetch-users";

const SideBar = async () => {
  const conversationsPromise = await fetchConversations(1, 10, "");
  const usersPromise = await fetchUsers(1, 10, "");
  const currentUserPromise = await fetchCurrentUser();

  const [conversations, users, currentUser] = await Promise.all([
    conversationsPromise,
    usersPromise,
    currentUserPromise,
  ]);
  return (
    <ConversationList
      initialConversations={conversations.data}
      initialUsers={users}
      currentUser={currentUser.data}
    />
  );
};
export default SideBar;
