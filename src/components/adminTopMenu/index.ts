import { Component, declareComponent,IElmerEvent,IPropCheckRule, propTypes } from "elmer-ui-core";
import { IAdminMenuData } from "../adminMenu/IAdminMenuData";
import "./index.less";

@declareComponent({
    selector: "adminTopMenu"
})
export class AdminTopMenuComponent extends Component {
    static propType:any = {
        theme: <IPropCheckRule>{
            defaultValue: "",
            description: "样式",
            rule: propTypes.string.isRequired
        },
        isExpand: <IPropCheckRule> {
            defaultValue: true,
            description: "是否显示按钮图标",
            rule: propTypes.boolean
        },
        style: <IPropCheckRule> {
            defaultValue: " ",
            description: "内联样式",
            rule: propTypes.string
        },
        onChange: <IPropCheckRule> {
            description: "单击事件",
            rule: propTypes.func
        },
        data: <IPropCheckRule> {
            description: "临时存储的数据",
            rule: propTypes.array.isRequired
        },
        logoText: <IPropCheckRule> {
            defaultValue: "后台管理系统",
            description: "logo文本",
            rule: propTypes.string.isRequired
        },
        logoImage: <IPropCheckRule> {
            defaultValue: "./assets/logo.png",
            description: "logo图片",
            rule: propTypes.string.isRequired
        },
        showLogoImage: <IPropCheckRule> {
            defaultValue: true,
            description: "logo显示图片还是文本",
            rule: propTypes.boolean.isRequired
        }
    };
    state: any = {
        hasTitle: false,
        icon: "fa-bars",
        expandIcon: "fa-bars",
        collapseIcon: "fa-th-list",
        data: [],
        selectedData: null,
        hasExpand: true
    };
    props:any;
    constructor(props: any) {
        super(props);
        this.state.hasTitle = !this.isEmpty(props.title);
        this.state.data = this.getMenuData(props.data || []);
        this.state.icon = props.hasExpand ? this.state.expandIcon : this.state.collapseIcon;
    }
    handleOnItemClick(evt:IElmerEvent): void {
        const itemData:IAdminMenuData = JSON.parse(JSON.stringify(evt.data.item));
        if(itemData.items && itemData.items.length>0) {
            if(this.state.hasExpand) {
                const newData:IAdminMenuData[] = JSON.parse(JSON.stringify(this.state.data));
                itemData.expand = !itemData.expand;
                for(let i=0,maxLen=newData.length;i<maxLen;i++) {
                    const tmpItem = newData[i];
                    if(tmpItem.id === itemData.id) {
                        newData[i] = itemData;
                        break;
                    }
                }
                this.setState({
                    data: newData
                });
            }
        } else {
            // this.setState({
            //     selectedData: itemData
            // });
            typeof this.props.onChange === "function" && this.props.onChange({
                data: itemData,
                nativeEvent: evt.nativeEvent,
                target: evt.target
            });
        }
    }
    handleOnSubItemClick(evt:IElmerEvent): void {
        const itemData:IAdminMenuData = JSON.parse(JSON.stringify(evt.data.subItem));
        // this.setState({
        //     selectedData: itemData
        // });
        typeof this.props.onChange === "function" && this.props.onChange({
            data: itemData,
            nativeEvent: evt.nativeEvent,
            target: evt.target
        });
    }
    render(): string {
        return require("./index.html");
    }
    private getMenuData(menuData:IAdminMenuData[]): IAdminMenuData[] {
        const menu:IAdminMenuData[] = menuData || [];
        const mLen = menu.length;
        for(let i=0;i<mLen;i++) {
            const menuItem = menu[i];
            if(this.isEmpty(menuItem.id)) {
                menu[i].id = `menu${i}`;
            }
            if(menuItem.items && menuItem.items.length>0) {
                for(let j=0,subLen = menuItem.items.length; j<subLen;j++) {
                    const subItem = menuItem.items[j];
                    if(this.isEmpty(subItem.id)) {
                        menu[i].items[j].id = `subMenu${i}${j}`;
                    }
                }
            }
        }
        return menu;
    }
}
