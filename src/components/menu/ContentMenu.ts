import { Component, declareComponent, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import "./ContentMenuItem";
import "./style.less";

@declareComponent({
    selector: "contentMenu"
})
export class ContentMenu extends Component {
    static propType: any = {
        data: <IPropCheckRule> {
            defaultValue: [],
            description: "数据源",
            propertyKey: "data",
            rule: propTypes.array.isRequired
        },
        onItemClick: <IPropCheckRule>{
            description: "菜单项单击事件",
            propertyKey: "data",
            rule: propTypes.func
        },
        style: <IPropCheckRule> {
            defaultValue: "",
            description: "内联样式",
            rule: propTypes.string
        },
        visible:  <IPropCheckRule> {
            defaultValue: false,
            description: "是否显示",
            propertyKey: "visible",
            rule: propTypes.boolean
        }
    };
    private data: any[] = [];
    private visible: boolean = false;
    constructor(props:any) {
        super(props);
        this.data = props.data || [];
    }
    $onPropsChanged(newProps: any): void {
        if(JSON.stringify(newProps.data) !== JSON.stringify(this.data) || newProps.visible !== this.visible) {
            this.setData({
                data: JSON.parse(JSON.stringify(newProps.data || [])),
                visible: newProps.visible
            }, true);
        }
    }
    handleOnContextClick(event:IElmerEvent): void {
        event.nativeEvent.cancelBubble = true;
        event.nativeEvent.stopPropagation();
    }
    handleOnMenuItemClick(event:IElmerEvent): void {
        event.nativeEvent.cancelBubble = true;
        event.nativeEvent.stopPropagation();
        typeof this.props.onItemClick === "function" && this.props.onItemClick(event);
    }
    handleOnMouseDown(event:IElmerEvent): any {
        event.nativeEvent.cancelBubble = true;
        event.nativeEvent.stopPropagation();
        event.nativeEvent.preventDefault();
        return false;
    }
    render(): string {
        return require("./views/ContentMenu.html");
    }
}
