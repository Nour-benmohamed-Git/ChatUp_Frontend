import { updateFriendRequestStatusToAccepted } from "@/app/_actions/friend-request-actions/accept-friend-request";
import { updateFriendRequestStatusToDeclined } from "@/app/_actions/friend-request-actions/decline-friend-request";
import { formatChatSessionDate } from "@/utils/helpers/dateHelpers";
import { FC, memo } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "sonner";
import Avatar from "../avatar/avatar";
import { FriendRequestListItemProps } from "./friend-request-list-item.types";

const FriendRequestListItem: FC<FriendRequestListItemProps> = (props) => {
  const { friendRequestData } = props;

  const handleAccept = () => {
    console.log(friendRequestData.id)
    updateFriendRequestStatusToAccepted(friendRequestData.id as number)
      .then(() => {
        toast.success("Friend request accepted.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleDecline = () => {
    updateFriendRequestStatusToDeclined(friendRequestData.id as number)
      .then(() => {
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

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAccept}
            className="flex-1 bg-green-600 hover:bg-green-500 transition-colors duration-300 p-2 rounded-md focus:outline-none flex items-center justify-center"
          >
            <FaCheckCircle className="w-4 h-4 mr-1" />
            <span className="text-xs font-bold">Accept</span>
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-red-600 hover:bg-red-500 transition-colors duration-300 p-2 rounded-md focus:outline-none flex items-center justify-center"
          >
            <FaTimesCircle className="w-4 h-4 mr-1" />
            <span className="text-xs font-bold">Decline</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(FriendRequestListItem);