export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  badge?: string;
  children?: NavItem[];
}

export interface SidebarConfig {
  main: NavItem[];
  secondary?: NavItem[];
}
