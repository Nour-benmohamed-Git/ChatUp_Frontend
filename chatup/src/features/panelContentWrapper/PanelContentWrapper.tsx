import FilterBar from "@/app/components/filterBar/FilterBar";
import SearchField from "@/app/components/searchField/SearchField";
import { ConversationFilter } from "@/utils/constants/globals";
import { Dispatch, FC, memo, SetStateAction } from "react";
import { PanelContentWrapperProps } from "./PanelContentWrapper.types";

const PanelContentWrapper: FC<PanelContentWrapperProps> = (props) => {
  const {
    children,
    height,
    hasSearchField,
    paddingClass,
    label,
    setParamToSearch,
    hasFilterBar,
    activeFilter,
    setActiveFilter,
  } = props;

  return (
    <>
      {hasSearchField && label !== "archived" ? (
        <div className="px-2 py-2.5">
          <SearchField
            id={`${label}_search_field`}
            name={"search_field"}
            placeholder={"Search"}
            setParamToSearch={setParamToSearch}
          />
        </div>
      ) : null}
      {hasFilterBar && label !== "archived" ? (
        <FilterBar
          activeFilter={activeFilter as ConversationFilter}
          setActiveFilter={
            setActiveFilter as Dispatch<SetStateAction<ConversationFilter>>
          }
        />
      ) : null}
      <div
        className={`overflow-y-auto ${paddingClass} ${height}`}
        // style={{ height: height }}
      >
        {children}
      </div>
    </>
  );
};
export default memo(PanelContentWrapper);
