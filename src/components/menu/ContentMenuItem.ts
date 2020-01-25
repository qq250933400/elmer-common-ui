import { Component, declareComponent, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { EnumContentMenuItemType } from "./EContentMenu";
import "./style.less";

@declareComponent({
    selector: "contentMenuItem",
    template: {
        url: "./views/ContentMenuItem.html",
        fromLoader: true
    }
})
export class ContentMenuItem extends Component {
    static propType: any = {
        click: <IPropCheckRule>{
            defaultValue: null,
            description: "单击事件",
            rule: propTypes.func
        },
        data: <IPropCheckRule>{
            defaultValue: {},
            description: "菜单数据",
            propertyKey: "data",
            rule: propTypes.any
        },
        icon: <IPropCheckRule>{
            defaultValue: "",
            description: "菜单图标",
            rule: propTypes.string
        },
        value: <IPropCheckRule>{
            defaultValue: "",
            description: "菜单值",
            rule: propTypes.any
        },
        title: <IPropCheckRule>{
            defaultValue: "菜单项",
            description: "菜单标题",
            rule: propTypes.oneOf([propTypes.number, propTypes.string]).isRequired
        },
        type: <IPropCheckRule> {
            defaultValue: EnumContentMenuItemType.NormalText,
            description: "菜单项类型",
            rule: propTypes.string.isRequired
        },
    };
    private typeTheme?: string = "";
    private data?: any;
    constructor(props: any) {
        super(props);
        this.data = JSON.parse(JSON.stringify(props.data || {}));
    }
    $onPropsChanged(newProps: any): void {
        if(JSON.stringify(newProps.data) !== JSON.stringify(this.data)) {
            this.setData({
                data: JSON.parse(JSON.stringify(newProps.data || {}))
            }, true);
        }
    }
    onItemClick(myEvent: IElmerEvent): void {
        myEvent.nativeEvent.cancelBubble = true;
        myEvent.nativeEvent.stopPropagation();
        myEvent.nativeEvent.preventDefault();
        const hasChildren = this.data && this.data.children && this.data.children.length>0;
        if(!hasChildren) {
            myEvent.data = this.data;
            typeof this.props.click === "function" && this.props.click(myEvent);
        }
    }
}
