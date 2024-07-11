import { fetchConversations } from "@/app/_actions/conversationActions/fetchConversations";
import Loader from "@/app/components/loader/Loader";
import Skeleton from "@/app/components/skeleton/Skeleton";
import { useSocket } from "@/context/SocketContext";
import PanelContentWrapper from "@/features/panelContentWrapper/PanelContentWrapper";
import {
  ConversationResponse,
  ConversationsResponse,
} from "@/types/ChatSession";
import dynamic from "next/dynamic";
import { FC, memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ConversationListProps } from "./ConversationList.types";

const ConversationItem = dynamic(
  () => import("../conversationItem/ConversationItem"),
  { loading: () => <Skeleton />, ssr: false }
);
const ConversationList: FC<ConversationListProps> = (props) => {
  const { label, initialConversations, currentUser } = props;
  const { socket } = useSocket();
  const [dataSource, setDataSource] = useState<ConversationResponse[]>(
    initialConversations?.data
  );
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: initialConversations?.total,
  });
  const [paramToSearch, setParamToSearch] = useState<string>("");
  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newConversations = (await fetchConversations(
      nextPage,
      paginator.offset,
      paramToSearch
    )) as { data: ConversationsResponse };
    setDataSource((prevItems) => [
      ...prevItems,
      ...newConversations.data?.data,
    ]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };
  useEffect(() => {
    const fetchNewUsers = async () => {
      const newConversations = (await fetchConversations(
        1,
        paginator.offset,
        paramToSearch
      )) as { data: ConversationsResponse };
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newConversations.data?.total,
      }));
      setDataSource(newConversations.data?.data);
    };
    fetchNewUsers();
  }, [paramToSearch, paginator.offset]);

  useEffect(() => {
    const handleNotification = (chatSessionData: any) => {
      switch (chatSessionData.type) {
        case "updateChatListOnAddition":
          setDataSource((prevChatSessions: any) => {
            const chatSessionIndex = prevChatSessions.findIndex(
              (chatSession: any) => chatSession.id === chatSessionData.data.id
            );
            if (chatSessionIndex !== -1) {
              return prevChatSessions.map((chatSession: any) => {
                if (chatSession.id === chatSessionData.data.id) {
                  return {
                    ...chatSession,
                    lastMessage: chatSessionData.data.lastMessage,
                    senderId: chatSessionData.senderId,
                    unreadMessagesCount: chatSessionData.unreadMessagesCount,
                  };
                }
                return chatSession;
              });
            } else {
              return [
                ...prevChatSessions,
                {
                  id: chatSessionData.data.id,
                  title: chatSessionData.data.title,
                  image: chatSessionData.data.image,
                  lastMessage: chatSessionData.data.lastMessage,
                  senderId: chatSessionData.senderId,
                  unreadMessagesCount: chatSessionData.unreadMessagesCount,
                  participantsData: chatSessionData.participantsData,
                },
              ];
            }
          });
          break;
        case "updateChatListOnMessageEdit":
          setDataSource((prevChatSessions: any) => {
            return prevChatSessions?.map((chatSession: any) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  lastMessage: chatSessionData.data.lastMessage.content,
                };
              }
              return chatSession;
            });
          });
          break;
        case "markAsReadOnChatListUpdate":
          setDataSource((prevChatSessions: any) => {
            return prevChatSessions?.map((chatSession: any) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  senderId: chatSessionData.senderId,
                  unreadMessagesCount: chatSessionData.unreadMessagesCount,
                };
              }
              return chatSession;
            });
          });
          break;
        case "updateChatListOnHardRemoval":
          setDataSource((prevChatSessions: any) => {
            return prevChatSessions?.map((chatSession: any) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  lastMessage: chatSessionData.data.lastMessage,
                  senderId: chatSessionData.senderId,
                  unreadMessagesCount: chatSessionData.unreadMessagesCount,
                };
              }
              return chatSession;
            });
          });
          break;
        default:
          console.log("Unknown notification type:", chatSessionData.type);
      }
    };

    if (socket) {
      socket.on("notification", handleNotification);
    }

    return () => {
      socket?.off("notification", handleNotification);
    };
  }, [socket, currentUser]);
  return (
    <PanelContentWrapper
      hasSearchField
      hasFilterBar
      height="calc(100% - 7.75rem)"
      label={label}
      setParamToSearch={setParamToSearch}
    >
      <InfiniteScroll
        dataLength={dataSource?.length}
        next={fetchMoreData}
        hasMore={dataSource?.length < paginator.total}
        loader={<Loader />}
        height="calc(100% - 7.75rem)"
      >
        {dataSource?.map?.((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
      </InfiniteScroll>
    </PanelContentWrapper>
  );
};
export default memo(ConversationList);
