export interface BlocContainerProps {
  children: React.ReactNode;
  actions: {
    name: string;
    icon: JSX.Element;
  }[];
  height: string;
  hasSearchField?: boolean;
  hasChatControlPanel?: boolean;
  paddingClass?: string;
}
