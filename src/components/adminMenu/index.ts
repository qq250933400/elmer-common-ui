import { Component, declareComponent,IElmerEvent,IPropCheckRule, propTypes } from "elmer-ui-core";
import { IAdminMenuData } from "./IAdminMenuData";
import "./index.less";

type TypeAdminMenuProps = {
    disabled: IPropCheckRule;
    theme: IPropCheckRule;
    isExpand: IPropCheckRule;
    style: IPropCheckRule;
    onChange: IPropCheckRule;
    onModeChange: IPropCheckRule;
    data: IPropCheckRule;
    selectedData: IPropCheckRule;
};
type TypeAdminMenuState = {
    hasTitle: boolean;
    icon: string;
    expandIcon: string;
    collapseIcon: string;
    data: IAdminMenuData[];
    selectedData: IAdminMenuData;
    hasExpand: boolean;
}

@declareComponent({
    selector: "adminMenu"
})
export class AdminMenuComponent extends Component {
    static propType:TypeAdminMenuProps = {
        disabled: <IPropCheckRule>{
            defaultValue: false,
            description: "是否可用",
            rule: propTypes.boolean
        },
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
        onModeChange: <IPropCheckRule> {
            description: "菜单类型切换",
            rule: propTypes.func
        },
        data: <IPropCheckRule> {
            description: "临时存储的数据",
            rule: propTypes.array.isRequired
        },
        selectedData: {
            description: "默认选择菜单项",
            rule: propTypes.object
        }
    };
    state: TypeAdminMenuState = {
        hasTitle: false,
        icon: "fa-bars",
        expandIcon: "fa-bars",
        collapseIcon: "fa-th-list",
        data: [],
        selectedData: null,
        hasExpand: true
    };
    constructor(props: {[P in keyof TypeAdminMenuProps]: any}) {
        super(props);
        this.state.hasExpand = props.isExpand;
        // this.state.hasTitle = !this.isEmpty(props.title);
        this.state.data = this.getMenuData(props.data || []);
        this.state.icon = !props.isExpand ? this.state.expandIcon : this.state.collapseIcon;
        this.state.selectedData = props.selectedData;
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
            this.setState({
                selectedData: itemData
            });
            typeof this.props.onChange === "function" && this.props.onChange({
                data: itemData,
                nativeEvent: evt.nativeEvent,
                target: evt.target
            });
        }
    }
    handleOnSubItemClick(evt:IElmerEvent): void {
        const itemData:IAdminMenuData = JSON.parse(JSON.stringify(evt.data.subItem));
        this.setState({
            selectedData: itemData
        });
        typeof this.props.onChange === "function" && this.props.onChange({
            data: itemData,
            nativeEvent: evt.nativeEvent,
            target: evt.target
        });
    }
    handleOnExpandClick(evt:IElmerEvent): void {
        const newStateExpand = !this.state.hasExpand;
        this.setState({
            hasExpand: newStateExpand,
            icon: newStateExpand ? this.state.expandIcon : this.state.collapseIcon
        });
        typeof this.props.onModeChange === "function" && this.props.onModeChange({
            data: newStateExpand,
            nativeEvent: evt.nativeEvent,
            target: evt.target
        });
    }
    $onPropsChanged(props: {[P in keyof TypeAdminMenuProps]: any}): void {
        const updateState:any = {};
        let hasChangeValue = false;
        if(JSON.stringify(props.data) !== JSON.stringify(this.state.data)) {
            updateState.data = this.getMenuData(props.data || []);
            hasChangeValue = true;
        }
        if(props.isExpand !== this.state.hasExpand) {
            updateState.hasExpand = props.isExpand;
            updateState.icon = props.isExpand ? this.state.expandIcon : this.state.collapseIcon;
            hasChangeValue = true;
        }
        hasChangeValue && this.setState(updateState);
    }
    handleOnClick(evt:any):void {
        evt.data = this.props.data;
        typeof this.props.onClick === "function" && this.props.onClick(evt);
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
