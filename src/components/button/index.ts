import { Component, declareComponent,IPropCheckRule,propTypes } from "elmer-ui-core";
import "./index.less";

@declareComponent({
    selector: "button"
})
export class ButtonComponent extends Component {
    static propType:any = {
        disabled: <IPropCheckRule>{
            defaultValue: false,
            description: "是否可用",
            rule: propTypes.boolean
        },
        theme: <IPropCheckRule>{
            defaultValue: "eui-button-default",
            description: "按钮样式",
            rule: propTypes.string.isRequired
        },
        title: <IPropCheckRule> {
            defaultValue: "",
            description: "按钮标题",
            rule: propTypes.string
        },
        icon: <IPropCheckRule> {
            defaultValue: "",
            description: "按钮图标样式",
            rule: propTypes.string
        },
        hasIcon: <IPropCheckRule> {
            defaultValue: false,
            description: "是否显示按钮图标",
            rule: propTypes.boolean
        },
        type:  <IPropCheckRule> {
            defaultValue: "button",
            description: "按钮类型",
            rule: propTypes.string
        },
        style: <IPropCheckRule> {
            defaultValue: " ",
            description: "内联样式",
            rule: propTypes.string
        },
        loading:  <IPropCheckRule> {
            defaultValue: false,
            description: "是否显示loading",
            rule: propTypes.boolean
        },
        onClick: <IPropCheckRule> {
            description: "单击事件",
            rule: propTypes.func
        },
        data: <IPropCheckRule> {
            description: "临时存储的数据",
            rule: propTypes.any
        }
    };
    props:any;
    state: any = {
        hasTitle: false,
        buttonType: "button"
    };
    constructor(props: any) {
        super(props);
        this.state.hasTitle = !this.isEmpty(props.title);
        if(!this.isEmpty(props.type)) {
            this.state.buttonType = props.type;
        }
    }
    $onPropsChanged(newProps: any): void {
        this.setState({
            hasTitle: !this.isEmpty(newProps.title)
        },true);
    }
    handleOnClick(evt:any):void {
        if(!evt.data) {
            evt.data = this.props.data;
        } else if(this.props.data) {
            evt.data = {
                ...evt.data,
                ...this.props.data
            };
        }
        typeof this.props.onClick === "function" && this.props.onClick(evt);
    }
    render(): string {
        return require("./index.html");
    }
}
