export interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
}
