import { fetchConversations } from "@/app/_actions/conversationActions/fetchConversations";
import Avatar from "@/app/components/avatar/Avatar";
import Loader from "@/app/components/loader/Loader";
import SearchField from "@/app/components/searchField/SearchField";
import {
  ConversationResponse,
  ConversationsResponse,
} from "@/types/ChatSession";
import { ChatSessionType } from "@/utils/constants/globals";
import React, { memo, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import ConversationToPick from "../conversationToPick/ConversationToPick";
import { ConversationsPickerProps } from "./ConversationsPicker.types";

const ConversationsPicker: React.FC<ConversationsPickerProps> = ({
  initialConversations,
}) => {
  const { watch, setValue, getValues } = useFormContext();

  const [paramToSearch, setParamToSearch] = useState<string>("");
  const [dataSource, setDataSource] = useState<ConversationResponse[]>(
    initialConversations.data
  );
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: initialConversations.total,
  });
  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newConversations = (await fetchConversations({
      page: nextPage,
      offset: paginator.offset,
      search: paramToSearch,
    })) as { data: ConversationsResponse };
    setDataSource((prevItems) => [...prevItems, ...newConversations.data.data]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };
  useEffect(() => {
    const fetchNewConversations = async () => {
      const newConversations = (await fetchConversations({
        page: 1,
        offset: paginator.offset,
        search: paramToSearch,
      })) as { data: ConversationsResponse };
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newConversations.data.total,
      }));
      setDataSource(newConversations.data.data);
    };
    fetchNewConversations();
  }, [paramToSearch, paginator.offset]);

  const handleCheckChange = (conversationId: number) => {
    if (
      getValues("conversationIds").length < 5 ||
      getValues("conversationIds").includes(conversationId)
    ) {
      const currentChecked = getValues("conversationIds");

      const newChecked = currentChecked.includes(conversationId)
        ? currentChecked.filter((id: number) => id !== conversationId)
        : [...currentChecked, conversationId];

      setValue("conversationIds", newChecked);
    } else {
      toast.warning("You can only select up to 5 conversations.");
    }
  };
  const handleRemoveConversation = (conversationId: number) => {
    const currentChecked = getValues("conversationIds");

    const newChecked = currentChecked.filter((id: number) => id !== conversationId);

    setValue("conversationIds", newChecked);
  };
  return (
    <div className="flex flex-1 flex-col gap-2 w-full">
      <div className="relative">
        <div className="sticky top-0 z-50 shadow-md flex flex-col">
          <SearchField
            id="search_field"
            name="search_field"
            placeholder="Search"
            setParamToSearch={setParamToSearch}
          />
          {watch("conversationIds").length > 0 && (
            <div className="flex items-center flex-wrap gap-2 bg-white rounded-md shadow p-2">
              {watch("conversationIds").map((conversationId: number) => {
                const conversation = initialConversations.data.find(
                  (conversation) => conversation.id === conversationId
                );
                return conversation ? (
                  <div
                    key={conversation.id}
                    className="flex items-center gap-2 p-2 bg-gold-200 rounded-lg shadow-md"
                  >
                    <div className="flex-shrink-0">
                      {conversation.type === ChatSessionType.GROUP ? (
                        <div className="relative h-12 w-12">
                          {typeof conversation.image === "string" ? (
                            <Avatar
                              additionalClasses="h-12 w-12"
                              rounded="rounded-full"
                              fileName={conversation.image as string}
                            />
                          ) : conversation?.image?.length === 1 ? (
                            [conversation.image[0], ""].map((image, index) => (
                              <Avatar
                                key={index}
                                additionalClasses={`h-8 w-8 absolute ${
                                  index === 0
                                    ? "top-0 left-4"
                                    : "-top-4 right-0"
                                }`}
                                rounded={`rounded-full ${
                                  typeof image === "string" && image !== ""
                                    ? ""
                                    : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                                }`}
                                fileName={image}
                              />
                            ))
                          ) : (
                            conversation?.image
                              ?.slice(0, 2)
                              .map((image, index) => (
                                <Avatar
                                  key={index}
                                  additionalClasses={`h-8 w-8 absolute ${
                                    index === 0
                                      ? "top-0 left-4"
                                      : "-top-4 right-0"
                                  }`}
                                  rounded={`rounded-full ${
                                    typeof image === "string" && image !== ""
                                      ? ""
                                      : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                                  }`}
                                  fileName={image}
                                />
                              ))
                          )}
                        </div>
                      ) : (
                        <Avatar
                          additionalClasses="h-12 w-12"
                          rounded={`rounded-full ${
                            typeof conversation.image === "string" &&
                            conversation.image !== ""
                              ? ""
                              : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                          }`}
                          fileName={conversation.image as string}
                        />
                      )}
                    </div>
                    {/* <Avatar
                      fileName={conversation.image}
                      additionalClasses="w-8 h-8"
                      rounded="rounded-full"
                    /> */}
                    <span className="flex-grow">{conversation.title}</span>
                    <button
                      onClick={() => handleRemoveConversation(conversation.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiFillDelete className="w-5 h-5" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
      <div id="conversationsPickerContainer" className="flex-grow overflow-y-auto">
        <InfiniteScroll
          dataLength={dataSource?.length}
          next={fetchMoreData}
          hasMore={dataSource?.length < paginator.total}
          loader={<Loader />}
          scrollableTarget="conversationsPickerContainer"
        >
          {dataSource?.map?.((conversation) => (
            <ConversationToPick
              key={conversation.id}
              conversation={conversation}
              onCheckChange={() => handleCheckChange(conversation.id)}
              isChecked={watch("conversationIds").includes(conversation.id)}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default memo(ConversationsPicker);
