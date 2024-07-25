export interface DesktopItemProps {
  href: string;
  icon: any;
  active?: boolean;
  count?: number;
  onClick?: (e: React.MouseEvent) => void;
}
