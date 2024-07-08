import Header from "@/app/components/header/Header";
import { FC, memo } from "react";
import ChatControlPanel from "../conversationsSectionFeatures/chatControlPanel/ChatControlPanel";
import { BlocContainerProps } from "./BlocContainer.types";

const BlocContainer: FC<BlocContainerProps> = (props) => {
  const {
    children,
    actions,
    hasChatControlPanel,
    cssClass,
    toggleHandlers,
    label,
    userData,
    menuActionList,
    conversationRelatedData,
    title,
    messageListRef
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
      <div className={`${cssClass}`}>{children}</div>
      {hasChatControlPanel && conversationRelatedData ? (
        <ChatControlPanel conversationRelatedData={conversationRelatedData} messageListRef={messageListRef}/>
      ) : null}
    </>
  );
};
export default memo(BlocContainer);
