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
    combinedData,
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
        combinedData={combinedData}
        menuActionList={menuActionList}
        title={title}
      />
      <div className={`${cssClass}`}>{children}</div>
      {hasChatControlPanel && conversationRelatedData ? (
        <ChatControlPanel conversationRelatedData={conversationRelatedData} />
      ) : null}
    </>
  );
};
export default memo(BlocContainer);
