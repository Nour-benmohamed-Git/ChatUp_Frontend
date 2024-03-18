import { FC, memo } from "react";
import { PanelContentWrapperProps } from "./panel-content-wrapper.types";
import SearchField from "@/app/components/search-field/search-field";

const PanelContentWrapper: FC<PanelContentWrapperProps> = (props) => {
  const {
    children,
    height,
    hasSearchField,
    paddingClass,
    label,
    setParamToSearch,
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
