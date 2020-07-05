import dialog from "../components/dialog/dialog";
import { IContentMenuItem } from "../components/menu";
// tslint:disable: object-literal-shorthand
export type DesktopRunData = {
    type: "ElmerUI" | "React" | "Angular" | "Vue" | "Url" | "CallMethod" | "Route";
    props?: any;
    component?: string|Function;
    width?: number | string;
    height?: number | string;
    icon?: string;
    theme?: string;
    bottom?: string;
    bottomTheme?: string;
    showBottom?: boolean;
    showBarMax?: boolean;
    showBarMin?: boolean;
    showBarClose?: boolean;
    showIcon?: boolean;
    maxBarTheme?:string;
    titleTheme?: string;
    url?: string;
    hashRouter?: boolean;
};
// tslint:disable-next-line:interface-over-type-literal
export type DesktopApp = {
    title: string;
    icon: string;
    id: string;
    description?: string;
    data?: DesktopRunData;
};
export type TypeStartMenu = {
    name: string;
    id?: string;
    data?: DesktopApp[];
};

export const createDesktopAppContent = (appData: DesktopApp):string => {
    if(appData && appData.data) {
        if (appData.data.type === "ElmerUI") {
            return `<div style="display:block;width:100%;height:100%;overflow:auto;"><${appData.data.component} ...="{{exData}}" /></div>`;
        } else if (appData.data.type === "CallMethod") {
            typeof appData.data.component === "function" && appData.data.component();
            return "";
        } else if(appData.data.type === "Url") {
            return `<iframe style="display:block;width:100%;height:100%;border:0" frameBorder="0" src='${appData.data.url}'></iframe>`;
        } else {
            return "<span>Unsupport Content</span>";
        }
    } else {
        return "<span>No Content</span>";
    }
};

export const demoAppData:DesktopApp[] = [
    {
        title: "My Computer",
        icon: "fa-desktop",
        id: "-----------1",
        data: {
            type: "ElmerUI",
            component: "<eui-icon-demo />",
            showBottom: true,
            showBarMax: false,
            showBarMin: false,
            width: 290,
            height: 400,
            titleTheme: "ahaha"
        }
    }, {
        title: "DataView",
        icon: "fa-vcard",
        id: "-----------2",
        data: {
            type: "ElmerUI",
            component: "<eui-office-data-view />"
        }
    }, {
        title: "用户管理",
        icon: "fa-vcard",
        id: "-----------90",
        data: {
            type: "Route",
            hashRouter: false,
            component: "/user/setting"
        }
    },{
        title: "calendar",
        icon: "fa-calendar-plus-o",
        id: "-----------3",
        data: {
            type: "ElmerUI",
            component: "<eui-calendar />",
            showBottom: true,
            showBarMax: false,
            showBarMin: false,
            width: 290,
            height: 400,
            titleTheme: "ahaha"
        }
    }, {
        title: "全屏",
        id: "201912011136574222683",
        icon: "fa-support",
        data: {
            type: "CallMethod",
            hashRouter: false,
            component: function(): void {
                this.launchFullscreen(document.body);
            }
        }
    }, {
        title: "退出全屏",
        id: "201912011143414125807",
        icon: "fa-ge",
        data: {
            type: "CallMethod",
            component: function(): void {
                this.exitFullscreen();
            }
        }
    }
];

export const winStartmenuSideButtons: DesktopApp[] = [
    {
        title: "Users",
        icon: "fa-user",
        id: "2019120419462499010470"
    }, {
        title: "Images",
        icon: "fa-image",
        id: "201912041946145041640"
    }, {
        title: "Setting",
        icon: "fa-cog",
        id: "201912041946029353417",
        data: {
            type: "ElmerUI",
            component: "<eui-desktop-setting />",
            width: 700,
            height: 500
        }
    }, {
        title: "Logout",
        icon: "fa-power-off",
        id: "201912041945522559766",
        data: {
            type: "CallMethod",
            // tslint:disable-next-line: only-arrow-functions
            component: function(): void {
                dialog.alert({
                    title: "询问",
                    msgType: "OkCancel",
                    iconType: "Question",
                    message: "确定退出系统？",
                    onOk: (): void => {
                        // tslint:disable-next-line: no-console
                        console.log("logout");
                    }
                });
            }
        }
    }
];
export const DesktopMenus:IContentMenuItem[] = [
    { title: "刷新", icon:"fa-refresh", type: "NormalText" },
    { title: "SplitLine", type: "SplitLine" },
    { title: "上传", type: "NormalText", icon: "fa-upload" },
    { title: "新建文件夹", type: "NormalText", icon: "fa-folder" },
    { title: "新建文件", type: "NormalText", icon: "fa-file",children: [
        { title: "文本文件", type: "NormalText", icon: "fa-txt" },
        { title: "Html文件", type: "NormalText", icon: "fa-html" },
        { title: "PHP文件", type: "NormalText", icon: "fa-php" }
    ]},
    { title: "SplitLine", type: "SplitLine" },
    { title: "粘贴", type: "NormalText", icon: "fa-paste" },
    { title: "查看剪切板", type: "NormalText", icon: "fa-clipboard" },
    { title: "SplitLine", type: "SplitLine" },
    { title: "排序方式", type: "NormalText", icon: "fa-sort" },
    { title: "图标大小", type: "NormalText", icon: "fa-icon" },
    { title: "轻应用", type: "NormalText", icon: "fa-soft" },
    { title: "SplitLine", type: "SplitLine" },
    { title: "壁纸设置", type: "NormalText", icon: "fa-image" },
    { title: "主题设置", type: "NormalText", icon: "fa-theme" },
    { title: "系统设置", type: "NormalText", icon: "fa-system" }
];
export const mainMenuList:TypeStartMenu[] = [
    {
        name: "程序",
        id: "application",
        data: demoAppData
    },
    {
        name: "系统",
        id: "system",
        data: demoAppData
    }
];
export const SystemQuickStartTool: TypeStartMenu = {
    name: "系统工具",
    id: "systemTools",
    data: [
        {
            title: "全屏",
            id: "201912011136574222683",
            icon: "fa-support",
            data: {
                type: "CallMethod",
                // tslint:disable-next-line: object-literal-shorthand
                component: function(): void {
                    this.launchFullscreen(document.body);
                }
            }
        }, {
            title: "退出全屏",
            id: "201912011143414125807",
            icon: "fa-ge",
            data: {
                type: "CallMethod",
                // tslint:disable-next-line: object-literal-shorthand
                component: function(): void {
                    this.exitFullscreen();
                }
            }
        }
    ]
};

export const autoRunAppList:DesktopApp[] = [
    // {
    //     title: "Setting",
    //     icon: "fa-cog",
    //     id: "-3",
    //     data: {
    //         type: "ElmerUI",
    //         component: "eui-desktop-setting",
    //         width: 700,
    //         height: 500
    //     }
    // },
    // {
    //     title: "WebbookOnline",
    //     icon: "fa-book",
    //     id: "-3",
    //     data: {
    //         type: "ElmerUI",
    //         component: "eui-book",
    //         width: 700,
    //         height: 500
    //     }
    // }
];
// tslint:enable: object-literal-shorthand
