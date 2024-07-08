import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import Chip from "@/app/components/chip/Chip";
import MessagesLoader from "@/app/components/messagesLoader/MessagesLoader";
import ScrollToBottomButton from "@/app/components/scrollToBottomButton/ScrollToBottomButton";
import { useSocket } from "@/context/SocketContext";
import { Message, Messages } from "@/types/Message";
import { Direction } from "@/utils/constants/globals";
import {
  groupMessagesByDate,
  renderDateChip,
} from "@/utils/helpers/dateHelpers";
import dynamic from "next/dynamic";
import { FC, Fragment, memo, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { MessageListProps } from "./MessageList.types";

const MessageItem = dynamic(() => import("../messageItem/MessageItem"), {
  ssr: false,
});
const MessageList: FC<MessageListProps> = (props) => {
  const {
    conversationRelatedData,
    initialMessages,
    messageListRef,
    paramToSearch,
    searchResults,
    setSearchResults,
    currentSearchIndex,
    setCurrentSearchIndex,
  } = props;
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
    limit: 10,
    total: initialMessages.total,
    cursor: initialMessages.newCursor,
    direction: Direction.FORWARD,
    hasMoreBefore: initialMessages.hasMoreBefore,
    hasMoreAfter: initialMessages.hasMoreAfter,
  });
  const prevScrollTopRef = useRef<number>(0);
  const fetchMoreData = async (data: {
    limit: number;
    search: string;
    cursor?: { earliest?: number; latest?: number };
    direction: Direction;
  }) => {
    console.log("first");
    const newMessages = (await fetchConversationMessages(
      `${conversationRelatedData.conversationId}`,
      data
    )) as Messages;
    if (paramToSearch) {
      if (!data.cursor?.earliest && !data.cursor?.latest) {
        setDataSource(newMessages?.data);
        const newCursor = {
          earliest: newMessages?.data[0]?.timestamp,
          latest: newMessages?.data[newMessages?.data.length - 1]?.timestamp,
        };

        setPaginator((prevPaginator) => ({
          ...prevPaginator,
          cursor: newCursor,
          hasMoreBefore: newMessages.hasMoreBefore,
          hasMoreAfter: newMessages.hasMoreAfter,
        }));
      } else {
        setDataSource((prevItems) => {
          const combinedMessages =
            paginator.direction === Direction.FORWARD
              ? [...prevItems, ...newMessages?.data]
              : [...newMessages?.data, ...prevItems];

          const newCursor = {
            earliest: combinedMessages[0]?.timestamp,
            latest: combinedMessages[combinedMessages.length - 1]?.timestamp,
          };

          setPaginator((prevPaginator) => ({
            ...prevPaginator,
            cursor: newCursor,
            hasMoreBefore: newMessages.hasMoreBefore,
            hasMoreAfter: newMessages.hasMoreAfter,
          }));
          return combinedMessages;
        });
      }
    } else {
      setDataSource((prevItems) => {
        const combinedMessages =
          paginator.direction === Direction.FORWARD
            ? [...prevItems, ...newMessages?.data]
            : [...newMessages?.data, ...prevItems];

        const newCursor = {
          earliest: combinedMessages[0]?.timestamp,
          latest: combinedMessages[combinedMessages.length - 1]?.timestamp,
        };

        setPaginator((prevPaginator) => ({
          ...prevPaginator,
          cursor: newCursor,
          hasMoreBefore: newMessages.hasMoreBefore,
          hasMoreAfter: newMessages.hasMoreAfter,
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
      });
    }
  }, [paramToSearch]);

  useEffect(() => {
    if (conversationRelatedData?.conversationId) {
      socket?.emit("joinPrivateRoom", conversationRelatedData?.conversationId);
    }
    return () => {
      socket?.emit("leavePrivateRoom", conversationRelatedData?.conversationId);
    };
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
      }
    };
    socket?.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket?.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);
  // useEffect(() => {
  //   if (paramToSearch) {
  //     const results = dataSource.reduce<number[]>((acc, message, index) => {
  //       if (
  //         message?.content?.toLowerCase()?.includes(paramToSearch.toLowerCase())
  //       ) {
  //         acc.push(index);
  //       }
  //       return acc;
  //     }, []);
  //     setSearchResults(results);
  //     setCurrentSearchIndex(0);
  //   } else {
  //     setSearchResults([]);
  //     setCurrentSearchIndex(0);
  //   }
  // }, [paramToSearch, dataSource]);
  // useEffect(() => {
  //   if (messageListRef.current && searchResults.length > 0) {
  //     const selectedItemIndex = searchResults[currentSearchIndex];
  //     const selectedItem = messageListRef.current.children[0].children[0]
  //       .children[selectedItemIndex] as HTMLElement;
  //     if (selectedItem) {
  //       const containerHeight = messageListRef.current.offsetHeight;
  //       const itemHeight = selectedItem.offsetHeight;
  //       const scrollPosition =
  //         selectedItem.offsetTop - containerHeight / 2 + itemHeight / 2;
  //       messageListRef.current.scrollTo({
  //         top: scrollPosition,
  //         behavior: "smooth",
  //       });
  //     }
  //   }
  // }, [currentSearchIndex, searchResults]);
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
  if (!conversationRelatedData?.conversationId || !dataSource.length) {
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
              {messages?.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  conversationRelatedData={conversationRelatedData}
                  highlight={paramToSearch}
                  isHighlighted={
                    searchResults.includes(index) &&
                    currentSearchIndex === searchResults.indexOf(index)
                  }
                />
              ))}
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
