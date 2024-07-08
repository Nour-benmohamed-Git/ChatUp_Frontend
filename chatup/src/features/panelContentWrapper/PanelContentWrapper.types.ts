export interface PanelContentWrapperProps {
  children: React.ReactNode;
  height: string;
  hasSearchField?: boolean;
  paddingClass?: string;
  label?: string;
  setParamToSearch?: (search: string) => void;
  hasFilterBar?: boolean;
}
