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
  } = props;
  return (
    <>
      <Header actions={actions} />
      {hasSearchField ? (
        <SearchField
          id={"search_field"}
          name={"search_field"}
          placeholder={"Search"}
          autoComplete={"search..."}
        />
      ) : null}
      <div
        className={`overflow-y-auto bg-slate-700 ${paddingClass}`}
        style={{ height: height }}
      >
        {children}
      </div>
      {hasChatControlPanel ? <ChatControlPanel /> : null}
    </>
  );
};
export default memo(BlocContainer);
