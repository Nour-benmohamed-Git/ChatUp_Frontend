import FilterBar from "@/app/components/filterBar/filterBar";
import SearchField from "@/app/components/searchField/SearchField";
import { FC, memo } from "react";
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
  } = props;

  return (
    <>
      {hasSearchField ? (
        <div className="px-2 py-2.5">
          <SearchField
            id={`${label}_search_field`}
            name={"search_field"}
            placeholder={"Search"}
            setParamToSearch={setParamToSearch}
          />
        </div>
      ) : null}
      {hasFilterBar ? <FilterBar /> : null}
      <div
        className={`overflow-y-auto ${paddingClass}`}
        style={{ height: height }}
      >
        {children}
      </div>
    </>
  );
};
export default memo(PanelContentWrapper);
