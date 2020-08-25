import { Component, declareComponent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { iconTypes } from "./iconTypes";

@declareComponent({
    selector: "icon"
})
export class Icon extends Component {
    static propTypes: any = {
        type: <IPropCheckRule> {
            defaultValue: iconTypes[0],
            description: "图标类型",
            propertyKey: "iconTheme",
            rule: propTypes.oneValueOf(iconTypes)
        },
        theme: <IPropCheckRule> {
            defaultValue: "",
            description: "类名",
            rule: propTypes.string
        },
        onClick: <IPropCheckRule> {
            description: "单击事件",
            rule: propTypes.func
        }
    };
    iconTheme: string = iconTypes[0];
    props:any;
    constructor(props: any) {
        super(props);
        this.iconTheme = props.type || iconTypes[0];
    }
    $onPropsChanged(newProps: any): void {
        this.setData({
            iconTheme: newProps.type || ""
        });
    }
    handleOnClick(): void {
        typeof this.props.onClick === "function" && this.props.onClick();
    }
    render(): string {
        return "<i et:click='handleOnClick' class='fa {{iconTheme}} {{props.theme}}'></i>";
    }
}
