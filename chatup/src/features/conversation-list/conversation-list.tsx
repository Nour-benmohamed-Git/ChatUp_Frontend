import { fetchConversations } from "@/app/_actions/conversation-actions/fetch-conversations";
import Loader from "@/components/loader/loader";
import Skeleton from "@/components/skeleton/skeleton";
import { useSocket } from "@/context/socket-context";
import { ConversationResponse } from "@/types/ChatSession";
import dynamic from "next/dynamic";
import { FC, memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PanelContentWrapper from "../panel-content-wrapper/panel-content-wrapper";
import { ConversationListProps } from "./conversation-list.types";
const ConversationListItem = dynamic(
  () => import("@/components/conversation-list-item/conversation-list-item"),
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
    const newUsers = await fetchConversations(
      nextPage,
      paginator.offset,
      paramToSearch
    );
    setDataSource((prevItems) => [...prevItems, ...newUsers?.data]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };
  useEffect(() => {
    const fetchNewUsers = async () => {
      const newUsers = await fetchConversations(
        1,
        paginator.offset,
        paramToSearch
      );
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newUsers.total,
      }));
      setDataSource(newUsers?.data);
    };
    fetchNewUsers();
  }, [paramToSearch, paginator.offset]);
  useEffect(() => {
    socket &&
      socket?.on("notification", (chatSessionData: any) => {
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
                      lastMessage: {
                        content: chatSessionData.data.lastMessage.content,
                        timestamp: chatSessionData.data.lastMessage.timestamp,
                      },
                      senderId: chatSessionData.senderId,
                      count: chatSessionData.count,
                    };
                  }
                  return chatSession;
                });
              } else {
                return [
                  ...prevChatSessions,
                  {
                    id: chatSessionData.data.id,
                    lastMessage: {
                      content: chatSessionData.data.lastMessage.content,
                      timestamp: chatSessionData.data.lastMessage.timestamp,
                    },
                    senderId: chatSessionData.senderId,
                    count: chatSessionData.count,
                    participantsData: chatSessionData.participantsData,
                  },
                ];
              }
            });
            break;
          case "markAsReadOnChatListUpdate":
            setDataSource((prevChatSessions: any) => {
              return prevChatSessions?.map((chatSession: any) => {
                if (chatSession.id === chatSessionData.data.id) {
                  return {
                    ...chatSession,
                    count: chatSessionData.count,
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
                    lastMessage: {
                      content: chatSessionData.data.lastMessage.content,
                      timestamp: chatSessionData.data.lastMessage.timestamp,
                    },
                    senderId: chatSessionData.senderId,
                    count: chatSessionData.count,
                  };
                }
                return chatSession;
              });
            });
            break;
          default:
            console.log("Unknown notification type:", chatSessionData.type);
        }
      });

    return () => {
      socket?.off(`user-${currentUser}`);
    };
  }, [socket, currentUser]);

  return (
    <PanelContentWrapper
      hasSearchField
      height="calc(100% - 7.5rem)"
      label={label}
      setParamToSearch={setParamToSearch}
    >
      <InfiniteScroll
        dataLength={dataSource?.length}
        next={fetchMoreData}
        hasMore={dataSource?.length < paginator.total}
        loader={<Loader />}
        height="calc(100vh - 12.5rem)"
      >
        {dataSource?.map?.((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
          />
        ))}
      </InfiniteScroll>
    </PanelContentWrapper>
  );
};
export default memo(ConversationList);
