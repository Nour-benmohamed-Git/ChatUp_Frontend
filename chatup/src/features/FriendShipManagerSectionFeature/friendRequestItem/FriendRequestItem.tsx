import { updateFriendRequestStatusToAccepted } from "@/app/_actions/friendRequestActions/updateFriendRequestStatusToAccepted";
import { updateFriendRequestStatusToDeclined } from "@/app/_actions/friendRequestActions/updateFriendRequestStatusToDeclined";
import Avatar from "@/app/components/avatar/Avatar";
import { useSocket } from "@/context/SocketContext";
import { formatChatSessionDate } from "@/utils/helpers/dateHelpers";
import { emitFriendRequest } from "@/utils/helpers/socket-helpers";
import { FC, memo } from "react";
import { toast } from "sonner";
import { FriendRequestItemProps } from "./FriendRequestItem.types";

const FriendRequestItem: FC<FriendRequestItemProps> = (props) => {
  const { friendRequestData } = props;
  const { socket } = useSocket();

  const handleAccept = () => {
    updateFriendRequestStatusToAccepted(friendRequestData.id as number)
      .then(() => {
        socket &&
          emitFriendRequest(socket, {
            action: "accept",
            friendRequest: friendRequestData,
          });
        toast.success("Friend request accepted.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleDecline = () => {
    updateFriendRequestStatusToDeclined(friendRequestData.id as number)
      .then(() => {
        socket &&
          emitFriendRequest(socket, {
            action: "decline",
            friendRequest: friendRequestData,
          });
        toast.success("Friend request declined.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="flex items-center rounded-md gap-4 m-2 px-2 py-3 bg-gray-900">
      <Avatar
        additionalClasses="h-12 w-12"
        rounded={`rounded-full ${
          typeof friendRequestData?.image === "string" &&
          friendRequestData?.image !== ""
            ? ""
            : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
        }`}
        fileName={friendRequestData?.image}
      />
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gold-600 truncate">
            {friendRequestData?.title}
          </div>
          <div className="text-xs text-gold-400 ml-2">
            {formatChatSessionDate(friendRequestData?.timestamp)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleAccept}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-xs font-bold transition-colors duration-300 p-2 rounded-md flex items-center justify-center"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-red-500 hover:bg-red-400 text-xs font-bold transition-colors duration-300 p-2 rounded-md flex items-center justify-center"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(FriendRequestItem);
