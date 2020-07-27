import { IPropCheckRule, PropTypes } from "elmer-ui-core";

export type TypeOfficeFormProps = {
    title?: string;
    tabMenu?: TypeOfficeFormTabItem[];
    onClick?: Function;
    quickApps?: TypeOfficeFormMenuButton[];
    statusBarCol1?: string;
    statusBarCol2?: string;
    statusBarCol3?: string;
    statusBarCol4?: string;
};

export type TypeOfficeFormPropsRule = {[P in keyof TypeOfficeFormProps]?: IPropCheckRule};

export type TypeOfficeFormState = TypeOfficeFormProps & {
    choseTabMenu?: any;
    choseTabIndex?: number;
};

export const createOfficeFormTabMenu = (config: TypeOfficeFormTabItem[]):TypeOfficeFormTabItem[] => {
    return config;
};

export const createOfficeQuickButtons = (config: TypeOfficeFormMenuButton[]): TypeOfficeFormMenuButton[] => {
    return config;
};

export const definePropType: TypeOfficeFormPropsRule = {
    title: {
        defaultValue: "Office Rubbon Application",
        rule: PropTypes.string.isRequired
    },
    tabMenu: {
        description: "顶部tab菜单",
        defaultValue: createOfficeFormTabMenu([{
            title: "测试菜单",
            menus: [
                {
                    title: "文件",
                    buttons: [
                        {
                            title: "保存",
                            icon: "icon-save-large"
                        }, {
                            title: "图库",
                            icon: "icon-imglib-large"
                        }, {
                            title: "图库",
                            icon: "icon-imglib-large"
                        }
                    ]
                }
            ]
        }, {
            title: "测试菜单2",
            menus: [{
                title: "插件",
                buttons: [
                    {
                        title: "进款",
                        icon: "icon-imglib-large"
                    }
                ]
            }]
        }]),
        rule: PropTypes.array.isRequired
    },
    onClick: {
        description: "按钮点击事件",
        rule: PropTypes.func
    },
    statusBarCol1: {
        description: "状态栏列1",
        defaultValue: "状态1",
        rule: PropTypes.string
    },
    statusBarCol2: {
        description: "状态栏列2",
        defaultValue: "状态2",
        rule: PropTypes.string
    },
    statusBarCol3: {
        description: "状态栏列3",
        defaultValue: "状态3",
        rule: PropTypes.string
    },
    statusBarCol4: {
        description: "状态栏列4",
        defaultValue: "日期：2020-07-26",
        rule: PropTypes.string
    },
    quickApps: {
        description: "快速启动按钮",
        defaultValue: createOfficeQuickButtons​​([
            {
                title: "保存",
                icon: "icon-save-samll"
            },{
                title: "图片",
                icon: "icon-undo-samll"
            },{
                title: "文件浏览",
                icon: "icon-computer-samll"
            },{
                title: "用户信息",
                icon: "icon-user-samll"
            }
        ]),
        rule: PropTypes.array.isRequired
    }
};

export type TypeOfficeFormMenuButton = {
    title: string;
    icon: string;
};

export type TypeOfficeFormTabMenuItem = {
    title: string;
    buttons: TypeOfficeFormMenuButton[];
};

export type TypeOfficeFormTabItem = {
    title: string;
    menus: TypeOfficeFormTabMenuItem[];
};
