import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import Chip from "@/app/components/chip/Chip";
import MessagesLoader from "@/app/components/messagesLoader/MessagesLoader";
import ScrollToBottomButton from "@/app/components/scrollToBottomButton/ScrollToBottomButton";
import { useMessages } from "@/context/MessageContext";
import { Messages } from "@/types/Message";
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
    combinedData,
    initialMessages,
    paramToSearch,
    searchResults,
    setSearchResults,
    currentSearchIndex,
    setCurrentSearchIndex,
    initialFriends,
  } = props;
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const prevScrollBottomRef = useRef<number>(0);
  const { messages, setMessages, messageListRef } = useMessages();

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
        setMessages(newMessages.data.data);
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
        setMessages((prevItems) => {
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
      setMessages((prevItems) => {
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
      !messages.map((el) => el.id).includes(searchResults[currentSearchIndex])
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

  const messageGroups = Object.entries(groupMessagesByDate(messages)).map(
    ([date, messages]) => ({
      date,
      messages,
    })
  );

  const handleScroll = (scrollTop: number) => {
    const direction =
      scrollTop > prevScrollBottomRef.current
        ? Direction.BACKWARD
        : Direction.FORWARD;
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      direction: direction,
    }));
    prevScrollBottomRef.current = scrollTop;
  };

  let content = null;
  if (conversationRelatedData?.conversationId === "new" || !messages.length) {
    content = (
      <div className="flex flex-col-reverse h-full py-2">
        <Chip content="Today" />
      </div>
    );
  } else {
    content = (
      <div
        id="scrollableDiv"
        ref={messageListRef}
        className={`flex ${
          paginator.direction === Direction.FORWARD
            ? "flex-col-reverse"
            : "flex-col"
        } px-2 md:px-8 py-2 h-[calc(100vh-8rem)] overflow-y-auto w-full`}
      >
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          dataLength={messages?.length}
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
                    className="w-full"
                  >
                    <MessageItem
                      key={message.id}
                      combinedData={combinedData}
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
