import { fetchFriendRequests } from "@/app/_actions/friend-request-actions/fetch-friend-requests";
import FriendRequestList from "@/features/friendRequestList/friend-request-list";
import SendFriendRequest from "@/features/send-friend-request/send-friend-request";

const FriendshipManager = async () => {
  const friendRequests = await fetchFriendRequests();

  return (
    <div className=" h-screen md:col-span-3 lg:col-span-2">
      <div className="grid h-full grid-cols-1 lg:grid-cols-5">
        <FriendRequestList friendRequests={friendRequests} />
        <SendFriendRequest />
      </div>
    </div>
  );
};
export default FriendshipManager;
