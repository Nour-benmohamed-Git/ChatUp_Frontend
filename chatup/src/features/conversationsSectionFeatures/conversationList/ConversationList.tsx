import { fetchConversations } from "@/app/_actions/conversationActions/fetchConversations";
import Loader from "@/app/components/loader/Loader";
import Skeleton from "@/app/components/skeleton/Skeleton";
import PanelContentWrapper from "@/features/panelContentWrapper/PanelContentWrapper";
import {
  ConversationsResponse
} from "@/types/ChatSession";
import dynamic from "next/dynamic";
import { FC, memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ConversationListProps } from "./ConversationList.types";
import { useChatSessions } from "@/context/ChatSessionContext";

const ConversationItem = dynamic(
  () => import("../conversationItem/ConversationItem"),
  { loading: () => <Skeleton />, ssr: false }
);
const ConversationList: FC<ConversationListProps> = (props) => {
  const { label, initialConversations } = props;
  const { chatSessions, setChatSessions } = useChatSessions();
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: initialConversations?.total,
  });
  const [paramToSearch, setParamToSearch] = useState<string>("");
  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newConversations = (await fetchConversations({
      page: nextPage,
      offset: paginator.offset,
      search: paramToSearch,
    })) as { data: ConversationsResponse };
    setChatSessions((prevItems) => [
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
      const newConversations = (await fetchConversations({
        page: 1,
        offset: paginator.offset,
        search: paramToSearch,
      })) as { data: ConversationsResponse };
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newConversations?.data?.total,
      }));
      setChatSessions(newConversations?.data?.data);
    };
    fetchNewUsers();
  }, [paramToSearch, paginator.offset]);
  return (
    <PanelContentWrapper
      hasSearchField
      hasFilterBar
      height="calc(100% - 7.75rem)"
      label={label}
      setParamToSearch={setParamToSearch}
    >
      <div id="scrollableDiv" className="flex-grow overflow-y-auto">
        <InfiniteScroll
          dataLength={chatSessions?.length}
          next={fetchMoreData}
          hasMore={chatSessions?.length < paginator.total}
          loader={<Loader />}
          scrollableTarget="scrollableDiv"
        >
          {chatSessions?.map?.((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </InfiniteScroll>
      </div>
    </PanelContentWrapper>
  );
};
export default memo(ConversationList);
