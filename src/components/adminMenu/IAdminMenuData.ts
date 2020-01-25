export interface IAdminMenuData {
    title: string;
    id?: string;
    url: string;
    icon?: string;
    hasIcon?: boolean;
    items?: IAdminMenuData[];
    expand?: boolean;
}
