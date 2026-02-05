type Link = {
    label: string;
    href: string;
    icon?: string;
    links?: Array<MenuLink>;
};

export type MenuLink = Link & {
    links?: Array<Link>;
};

export type HeaderProps = MenuLink[];
