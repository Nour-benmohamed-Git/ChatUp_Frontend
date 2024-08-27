import { fetchFriends } from "@/app/_actions/friendActions/fetchFriends";
import Avatar from "@/app/components/avatar/Avatar";
import Loader from "@/app/components/loader/Loader";
import SearchField from "@/app/components/searchField/SearchField";
import { UserResponse, UsersResponse } from "@/types/User";
import React, { memo, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import ForwardMessageItem from "../forwardMessageItem/ForwardMessageItem";
import { UsersPickerProps } from "./UsersPicker.types";

const UsersPicker: React.FC<UsersPickerProps> = ({ initialFriends }) => {
  const { watch, setValue, getValues } = useFormContext();

  const [paramToSearch, setParamToSearch] = useState<string>("");
  const [dataSource, setDataSource] = useState<UserResponse[]>(
    initialFriends.data
  );
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: initialFriends.total,
  });
  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newFriends = (await fetchFriends(
      nextPage,
      paginator.offset,
      paramToSearch
    )) as { data: UsersResponse };
    setDataSource((prevItems) => [...prevItems, ...newFriends.data.data]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };
  useEffect(() => {
    const fetchNewFriends = async () => {
      const newFriends = (await fetchFriends(
        1,
        paginator.offset,
        paramToSearch
      )) as { data: UsersResponse };
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newFriends.data.total,
      }));
      setDataSource(newFriends.data.data);
    };
    fetchNewFriends();
  }, [paramToSearch, paginator.offset]);

  const handleCheckChange = (userId: number) => {
    if (
      getValues("otherMembersIds").length < 5 ||
      getValues("otherMembersIds").includes(userId)
    ) {
      const currentChecked = getValues("otherMembersIds");

      const newChecked = currentChecked.includes(userId)
        ? currentChecked.filter((id: number) => id !== userId)
        : [...currentChecked, userId];

      setValue("otherMembersIds", newChecked);
    } else {
      toast.warning("You can only select up to 5 users.");
    }
  };
  const handleRemoveUser = (userId: number) => {
    const currentChecked = getValues("otherMembersIds");

    const newChecked = currentChecked.filter((id: number) => id !== userId);

    setValue("otherMembersIds", newChecked);
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
          {watch("otherMembersIds").length > 0 && (
            <div className="flex items-center flex-wrap gap-2 bg-white rounded-md shadow p-2">
              {watch("otherMembersIds").map((userId: number) => {
                const user = initialFriends.data.find(
                  (user) => user.id === userId
                );
                return user ? (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 bg-gold-200 rounded-lg shadow-md"
                  >
                    <Avatar
                      fileName={user.profilePicture}
                      additionalClasses="w-8 h-8"
                      rounded="rounded-full"
                    />
                    <span className="flex-grow">{user.username}</span>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
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
      <div id="scrollableDiv" className="flex-grow overflow-y-auto">
        <InfiniteScroll
          dataLength={dataSource?.length}
          next={fetchMoreData}
          hasMore={dataSource?.length < paginator.total}
          loader={<Loader />}
          scrollableTarget="scrollableDiv"
        >
          {dataSource?.map?.((user) => (
            <ForwardMessageItem
              key={user.id}
              userData={user}
              onCheckChange={() => handleCheckChange(user.id)}
              isChecked={watch("otherMembersIds").includes(user.id)}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default memo(UsersPicker);
