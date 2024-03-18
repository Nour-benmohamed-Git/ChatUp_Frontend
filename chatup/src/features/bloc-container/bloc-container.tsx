import Header from "@/app/components/header/header";
import SearchField from "@/app/components/search-field/search-field";
import { FC, memo } from "react";
import ChatControlPanel from "../conversationsSectionFeatures/chatControlPanel/ChatControlPanel";
import { BlocContainerProps } from "./bloc_container.types";

const BlocContainer: FC<BlocContainerProps> = (props) => {
  const {
    children,
    actions,
    hasChatControlPanel,
    hasSearchField,
    cssClass,
    toggleHandlers,
    label,
    userData,
    menuActionList,
    conversationRelatedData,
    title,
  } = props;
  return (
    <>
      <Header
        actions={actions}
        toggleHandlers={toggleHandlers}
        label={label}
        userData={userData}
        menuActionList={menuActionList}
        title={title}
      />
      {hasSearchField ? (
        <SearchField
          id={"sidebar_search_field"}
          name={"search_field"}
          placeholder={"Search"}
        />
      ) : null}
      <div className={`${cssClass}`}>{children}</div>
      {hasChatControlPanel && conversationRelatedData ? (
        <ChatControlPanel conversationRelatedData={conversationRelatedData} />
      ) : null}
    </>
  );
};
export default memo(BlocContainer);
