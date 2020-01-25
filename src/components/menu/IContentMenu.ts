import { EnumContentMenuItemType } from "./EContentMenu";

export interface IContentMenuItem {
    title: string;
    icon?: string;
    value?: any;
    type?: "NormalText" | "Title" | "SplitLine";
    children?: IContentMenuItem[];
}
