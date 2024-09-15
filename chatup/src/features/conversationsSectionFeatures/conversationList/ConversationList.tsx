import { fetchConversations } from "@/app/_actions/conversationActions/fetchConversations";
import Loader from "@/app/components/loader/Loader";
import PulsingLoader from "@/app/components/pulsingLoader/PulsingLoader";
import Skeleton from "@/app/components/skeleton/Skeleton";
import { useChatSessions } from "@/context/ChatSessionContext";
import PanelContentWrapper from "@/features/panelContentWrapper/PanelContentWrapper";
import { ConversationsResponse } from "@/types/ChatSession";
import { ConversationFilter } from "@/utils/constants/globals";
import dynamic from "next/dynamic";
import { FC, memo, useEffect, useState, useTransition } from "react";

import NoData from "@/app/components/noData/NoData";
import InfiniteScroll from "react-infinite-scroll-component";
import { ConversationListProps } from "./ConversationList.types";
import { AnimatePresence, motion } from "framer-motion";

const ConversationItem = dynamic(
  () => import("../conversationItem/ConversationItem"),
  { loading: () => <Skeleton />, ssr: false }
);
const ConversationList: FC<ConversationListProps> = (props) => {
  const { label, initialConversations, activeFilter, setActiveFilter } = props;
  const { chatSessions, setChatSessions } = useChatSessions();
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: initialConversations?.total,
  });
  const [isPending, startTransition] = useTransition(); // useTransition hook

  const [paramToSearch, setParamToSearch] = useState<string>("");
  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newConversations = (await fetchConversations({
      page: nextPage,
      offset: paginator.offset,
      search: paramToSearch,
      filter: activeFilter,
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
    const fetchNewUsers = () => {
      startTransition(async () => {
        const newConversations = (await fetchConversations({
          page: 1,
          offset: paginator.offset,
          search: paramToSearch,
          filter: activeFilter,
        })) as { data: ConversationsResponse };
        setPaginator((prevPaginator) => ({
          ...prevPaginator,
          page: 1,
          total: newConversations?.data?.total,
        }));
        setChatSessions(newConversations?.data?.data);
      });
    };
    fetchNewUsers();
  }, [paramToSearch, paginator.offset, activeFilter]);
  return (
    <PanelContentWrapper
      {...(activeFilter !== ConversationFilter.ARCHIVED && {
        hasSearchField: true,
        hasFilterBar: true,
        setParamToSearch,
        activeFilter,
        setActiveFilter,
      })}
      height={
        activeFilter !== ConversationFilter.ARCHIVED
          ? "h-[calc(100%-11.75rem)] md:h-[calc(100%-7.75rem)]"
          : "h-[calc(100%-4rem)] md:h-full"
      }
      label={label}
    >
      {isPending ? (
        <div className="flex items-center justify-center h-full">
          <PulsingLoader />
        </div>
      ) : chatSessions.length === 0 ? (
        <NoData />
      ) : (
        <div id="conversationsContainer" className="flex-grow overflow-y-auto">
          <InfiniteScroll
            dataLength={chatSessions?.length}
            next={fetchMoreData}
            hasMore={chatSessions?.length < paginator.total}
            loader={<Loader />}
            scrollableTarget="conversationsContainer"
          >
            <AnimatePresence initial={false}>
              {chatSessions?.map?.((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  layout
                >
                  <ConversationItem conversation={conversation} />
                </motion.div>
              ))}
            </AnimatePresence>
          </InfiniteScroll>
        </div>
      )}
    </PanelContentWrapper>
  );
};
export default memo(ConversationList);
