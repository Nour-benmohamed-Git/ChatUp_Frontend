import { sendFriendRequestFromSuggestion } from "@/app/_actions/friendRequestActions/sendFriendRequestFromSuggestion";
import { removeFriendSuggestion } from "@/app/_actions/friendSuggestionActions/removeFriendSuggestion";
import Avatar from "@/app/components/avatar/Avatar";
import { useSocket } from "@/context/SocketContext";
import { FriendRequestResponse } from "@/types/FriendRequest";
import { emitFriendRequest } from "@/utils/helpers/socket-helpers";
import { memo } from "react";
import { toast } from "sonner";
import { FriendSuggestionItemProps } from "./FriendSuggestionItem.types";

const FriendSuggestionItem: React.FC<FriendSuggestionItemProps> = (props) => {
  const { friendSuggestionData } = props;
  const { socket } = useSocket();

  const handleAddSuggestion = async () => {
    const response = await sendFriendRequestFromSuggestion(
      friendSuggestionData.id
    );
    if (response?.error) {
      toast.error(response.error.message);
    } else {
      if (
        socket &&
        (
          response as {
            data: FriendRequestResponse;
          }
        ).data
      ) {
        emitFriendRequest(socket, {
          action: "send",
          friendRequest: (
            response as {
              data: FriendRequestResponse;
            }
          ).data,
        });
        toast.success("Friend request has been successfully sent.");
      }
    }
  };

  const handleRemove = async () => {
    const response = await removeFriendSuggestion(friendSuggestionData.id);
    if (response?.error?.message) {
      toast.error(response?.error?.message);
    } else {
      toast.success("Friend suggestion removed.");
    }
  };

  const mutualFriendsImages = friendSuggestionData?.mutualFriendsImages ?? [];

  return (
    <div className="flex items-center rounded-md gap-4 px-2 py-3 mt-2 bg-gray-900">
      <Avatar
        additionalClasses="h-24 w-24 rounded-full"
        fileName={friendSuggestionData?.profilePicture}
      />
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-yellow-400 truncate">
            {friendSuggestionData?.username}
          </div>
          {mutualFriendsImages.length > 0 && (
            <div className="flex items-center text-sm justify-between text-gray-100">
              {mutualFriendsImages.length} mutual{" "}
              {mutualFriendsImages.length === 1 ? "friend" : "friends"}{" "}
              <div className="flex -space-x-2">
                {mutualFriendsImages.map((image, index) => (
                  <Avatar
                    key={`${image}-${index}`}
                    additionalClasses="h-7 w-7 rounded-full border-2 border-gray-900"
                    fileName={image}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddSuggestion}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-xs font-bold transition-colors duration-300 p-2 rounded-md flex items-center justify-center"
          >
            Add
          </button>
          <button
            onClick={handleRemove}
            className="flex-1 bg-red-500 hover:bg-red-400 text-xs font-bold transition-colors duration-300 p-2 rounded-md flex items-center justify-center"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(FriendSuggestionItem);
