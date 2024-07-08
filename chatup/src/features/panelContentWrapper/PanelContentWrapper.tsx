import SearchField from "@/app/components/searchField/SearchField";
import { FC, memo } from "react";
import { PanelContentWrapperProps } from "./PanelContentWrapper.types";
import FilterBar from "@/app/components/filterBar/filterBar";

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
        <SearchField
          id={`${label}_search_field`}
          name={"search_field"}
          placeholder={"Search"}
          setParamToSearch={setParamToSearch}
        />
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
