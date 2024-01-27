import Header from "@/components/header/header";
import SearchField from "@/components/search-field/search-field";
import { FC, memo } from "react";
import ChatControlPanel from "../chat-control-panel/chat-control-panel";
import { BlocContainerProps } from "./bloc_container.types";

const BlocContainer: FC<BlocContainerProps> = (props) => {
  const {
    children,
    actions,
    height,
    hasChatControlPanel,
    hasSearchField,
    paddingClass,
    toggleHandlers,
    label,
  } = props;

  return (
    <>
      <Header actions={actions} toggleHandlers={toggleHandlers} label={label} />
      {hasSearchField ? (
        <SearchField
          id={"sidebar_search_field"}
          name={"search_field"}
          placeholder={"Search"}
          autoComplete={"search..."}
        />
      ) : null}
      <div
        className={`overflow-y-auto ${paddingClass}`}
        style={{ height: height }}
      >
        {children}
      </div>
      {hasChatControlPanel ? <ChatControlPanel /> : null}
    </>
  );
};
export default memo(BlocContainer);
