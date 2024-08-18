import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import Chip from "@/app/components/chip/Chip";
import MessagesLoader from "@/app/components/messagesLoader/MessagesLoader";
import ScrollToBottomButton from "@/app/components/scrollToBottomButton/ScrollToBottomButton";
import { useSocket } from "@/context/SocketContext";
import { Message, Messages } from "@/types/Message";
import { Direction, globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookiesHelpers";
import {
  groupMessagesByDate,
  renderDateChip,
} from "@/utils/helpers/dateHelpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import dynamic from "next/dynamic";
import { FC, Fragment, memo, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { MessageListProps } from "./MessageList.types";

const MessageItem = dynamic(() => import("../messageItem/MessageItem"), {
  ssr: false,
});
const MessageList: FC<MessageListProps> = (props) => {
  const {
    conversation,
    conversationRelatedData,
    initialMessages,
    messageListRef,
    paramToSearch,
    searchResults,
    setSearchResults,
    currentSearchIndex,
    setCurrentSearchIndex,
    initialFriends,
  } = props;
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const { socket } = useSocket();
  const [dataSource, setDataSource] = useState<Message[]>(initialMessages.data);
  const [paginator, setPaginator] = useState<{
    limit: number;
    total: number;
    cursor: { earliest?: number; latest?: number };
    direction: Direction;
    hasMoreBefore: boolean;
    hasMoreAfter: boolean;
  }>({
    limit: 30,
    total: initialMessages.total,
    cursor: initialMessages.newCursor,
    direction: Direction.FORWARD,
    hasMoreBefore: initialMessages.hasMoreBefore,
    hasMoreAfter: initialMessages.hasMoreAfter,
  });
  const prevScrollTopRef = useRef<number>(0);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchMoreData = async (data: {
    limit: number;
    search: string;
    cursor?: { earliest?: number; latest?: number };
    direction: Direction;
    startIndex: number;
  }) => {
    const newMessages = (await fetchConversationMessages(
      `${conversationRelatedData.conversationId}`,
      data
    )) as { data: Messages };
    if (paramToSearch) {
      if (!data.cursor?.earliest && !data.cursor?.latest) {
        setDataSource(newMessages.data.data);
        const newCursor = {
          earliest: newMessages.data.data[0].timestamp,
          latest:
            newMessages.data.data[newMessages.data.data.length - 1].timestamp,
        };
        setSearchResults(newMessages.data.searchMatches);
        setPaginator((prevPaginator) => ({
          ...prevPaginator,
          cursor: newCursor,
          hasMoreBefore: newMessages.data.hasMoreBefore,
          hasMoreAfter: newMessages.data.hasMoreAfter,
        }));
      } else {
        setDataSource((prevItems) => {
          const combinedMessages =
            paginator.direction === Direction.FORWARD
              ? [...prevItems, ...newMessages.data.data]
              : [...newMessages.data.data, ...prevItems];

          const newCursor = {
            earliest: combinedMessages[0].timestamp,
            latest: combinedMessages[combinedMessages.length - 1].timestamp,
          };

          setPaginator((prevPaginator) => ({
            ...prevPaginator,
            cursor: newCursor,
            hasMoreBefore: newMessages.data.hasMoreBefore,
            hasMoreAfter: newMessages.data.hasMoreAfter,
          }));
          return combinedMessages;
        });
      }
    } else {
      setDataSource((prevItems) => {
        const combinedMessages =
          paginator.direction === Direction.FORWARD
            ? [...prevItems, ...newMessages.data.data]
            : [...newMessages.data.data, ...prevItems];

        const newCursor = {
          earliest: combinedMessages[0].timestamp,
          latest: combinedMessages[combinedMessages.length - 1].timestamp,
        };

        setPaginator((prevPaginator) => ({
          ...prevPaginator,
          cursor: newCursor,
          hasMoreBefore: newMessages.data.hasMoreBefore,
          hasMoreAfter: newMessages.data.hasMoreAfter,
        }));

        return combinedMessages;
      });
    }
  };
  useEffect(() => {
    if (paramToSearch) {
      fetchMoreData({
        limit: 0,
        search: paramToSearch,
        cursor: { earliest: undefined, latest: undefined },
        direction: paginator.direction,
        startIndex: 0,
      });
      setSearchResults([]);
      setCurrentSearchIndex(0);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  }, [paramToSearch]);

  useEffect(() => {
    if (socket && conversationRelatedData?.conversationId) {
      const handleJoinRoom = () => {
        socket.emit(
          "join_private_room",
          conversationRelatedData.conversationId
        );
      };

      handleJoinRoom(); // Initial join
      socket.io.on("reconnect", handleJoinRoom); // Rejoin on reconnect

      return () => {
        socket.emit(
          "leave_private_room",
          conversationRelatedData.conversationId
        );
        socket.io.off("reconnect", handleJoinRoom);
      };
    }
  }, [socket, conversationRelatedData?.conversationId]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage: any) => {
      switch (newMessage.action) {
        case "create":
          setDataSource((prevMessages) => [newMessage.data, ...prevMessages]);
          break;
        case "edit":
          setDataSource((prevMessages) =>
            prevMessages.map((message) => {
              if (message.id === newMessage.data.id) {
                return { ...message, ...newMessage.data };
              }
              return message;
            })
          );
          break;
        case "markAsRead":
          setDataSource((prevMessages) =>
            prevMessages.map((message) => {
              if (newMessage.messageIds?.includes(message.id)) {
                return { ...message, readStatus: true };
              }
              return message;
            })
          );
          break;
        case "hardRemove":
          setDataSource((prevMessages) =>
            prevMessages.filter((item) => item.id !== newMessage.data.id)
          );
          break;
        case "react":
          // console.log("newMessage in react", newMessage);
          setDataSource((prevMessages) =>
            prevMessages.map((message) => {
              if (message.id === newMessage.data.id) {
                return { ...message, reactions: newMessage.data.reactions };
              }
              return message;
            })
          );
          break;
      }
    };
    socket?.on("receive_Message", handleReceiveMessage);
    return () => {
      socket?.off("receive_Message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (searchResults.length && currentSearchIndex >= 0) {
      const highlightedMessageId = searchResults[currentSearchIndex];
      const highlightedElement = messageRefs.current[highlightedMessageId];
      if (highlightedElement && messageListRef.current) {
        const list = messageListRef.current;
        const topPos = highlightedElement.offsetTop;
        const offset =
          list.clientHeight / 2 - highlightedElement.clientHeight / 2;
        list.scrollTo({
          top: topPos - list.offsetTop - offset,
          behavior: "smooth",
        });
      }
    }
  }, [currentSearchIndex, searchResults]);

  useEffect(() => {
    if (
      paramToSearch &&
      !dataSource.map((el) => el.id).includes(searchResults[currentSearchIndex])
    ) {
      fetchMoreData({
        limit: 0,
        search: paramToSearch,
        cursor: { earliest: undefined, latest: undefined },
        direction: paginator.direction,
        startIndex: currentSearchIndex,
      });
    }
  }, [paramToSearch, currentSearchIndex]);

  useEffect(() => {
    if (socket && conversation && !conversation?.seen) {
      emitMessage(socket, {
        action: "markAsRead",
        message: {
          senderId: currentUserId,
          receiverId: conversationRelatedData?.secondMemberId as number,
          chatSessionId: conversationRelatedData?.conversationId as number,
        },
      });
    }
  }, [socket, conversation?.seen]);

  const messageGroups = Object.entries(groupMessagesByDate(dataSource)).map(
    ([date, messages]) => ({
      date,
      messages,
    })
  );

  const handleScroll = (scrollTop: number) => {
    const direction =
      scrollTop > prevScrollTopRef.current
        ? Direction.BACKWARD
        : Direction.FORWARD;
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      direction: direction,
    }));
    prevScrollTopRef.current = scrollTop;
  };

  let content = null;
  if (conversationRelatedData?.conversationId === "new" || !dataSource.length) {
    content = (
      <div className="flex flex-col-reverse h-full py-2">
        <Chip content="Today" />
      </div>
    );
  } else {
    content = (
      <div
        ref={messageListRef}
        id="scrollableDiv"
        className={`flex ${
          paginator.direction === Direction.FORWARD 
            ? "flex-col-reverse"
            : "flex-col"
        } px-2 md:px-8 py-2 h-[calc(100vh-8rem)] overflow-y-auto`}
      >
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          dataLength={dataSource?.length}
          next={() =>
            fetchMoreData({
              limit: paginator.limit,
              search: paramToSearch,
              cursor: paginator.cursor,
              direction: paginator.direction,
              startIndex: currentSearchIndex,
            })
          }
          hasMore={
            paginator.direction === Direction.FORWARD
              ? paginator.hasMoreBefore
              : paginator.hasMoreAfter
          }
          loader={<MessagesLoader />}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          inverse={paginator.direction === Direction.FORWARD}
          onScroll={(event) => {
            const target = event.target as HTMLDivElement;
            handleScroll(target.scrollTop);
          }}
        >
          {messageGroups.map(({ date, messages }) => (
            <Fragment key={date}>
              {messages?.map((message) => {
                const isHighlighted =
                  currentSearchIndex ===
                  searchResults.indexOf(message.id as number);
                return (
                  <div
                    key={message.id}
                    ref={(el) =>
                      (messageRefs.current[message.id as number] = el)
                    }
                  >
                    <MessageItem
                      key={message.id}
                      message={message}
                      conversationRelatedData={conversationRelatedData}
                      highlight={paramToSearch}
                      isHighlighted={isHighlighted}
                      initialFriends={initialFriends}
                    />
                  </div>
                );
              })}
              {renderDateChip(date)}
            </Fragment>
          ))}
        </InfiniteScroll>
        <ScrollToBottomButton targetRef={messageListRef} />
      </div>
    );
  }

  return <div className="relative h-full">{content}</div>;
};
export default memo(MessageList);
