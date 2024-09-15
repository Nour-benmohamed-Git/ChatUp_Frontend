"use client";
import { fetchSuggestions } from "@/app/_actions/friendSuggestionActions/fetchSuggestions";
import Loader from "@/app/components/loader/Loader";
import PanelContentWrapper from "@/features/panelContentWrapper/PanelContentWrapper";
import {
  FriendSuggestionResponse,
  FriendSuggestionsResponse,
} from "@/types/Suggestions";
import { FC, memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FriendSuggestionItem from "../friendSuggestionItem/FriendSuggestionItem";
import { FriendSuggestionListProps } from "./FriendSuggestionList.types";

const FriendSuggestionList: FC<FriendSuggestionListProps> = (props) => {
  const { initialFriendSuggestions } = props;
  const [dataSource, setDataSource] = useState<FriendSuggestionResponse[]>([]);
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: 0,
  });

  useEffect(() => {
    setDataSource(initialFriendSuggestions?.data);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      total: initialFriendSuggestions?.total,
    }));
  }, [initialFriendSuggestions]);

  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newSuggestions = (await fetchSuggestions(
      nextPage,
      paginator.offset
    )) as { data: FriendSuggestionsResponse };
    setDataSource((prevItems) => [...prevItems, ...newSuggestions.data.data]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };

  return (
    <PanelContentWrapper height="h-[calc(100vh-12.25rem)]">
      <div
        id="friendSuggestionsContainer"
        className="flex-grow overflow-y-auto"
      >
        <InfiniteScroll
          dataLength={dataSource.length}
          next={fetchMoreData}
          hasMore={dataSource.length < paginator.total}
          loader={<Loader />}
          scrollableTarget="friendSuggestionsContainer"
        >
          {dataSource.map((suggestion, index) => (
            <FriendSuggestionItem
              key={`${suggestion.username}-${index}`}
              friendSuggestionData={suggestion}
            />
          ))}
        </InfiniteScroll>
      </div>
    </PanelContentWrapper>
  );
};

export default memo(FriendSuggestionList);
