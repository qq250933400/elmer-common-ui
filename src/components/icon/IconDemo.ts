import { Component, declareComponent, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { iconTypes } from "./iconTypes";

@declareComponent({
    selector: "icon-demo"
})
export class IconDemo extends Component {
    static propType:any = {
        onClick: <IPropCheckRule> {
            description: "点击事件",
            rule: propTypes.func
        },
        onDblClick: <IPropCheckRule> {
            description: "双击事件",
            rule: propTypes.func
        }
    };
    data: any[] = [];
    props:any;
    constructor(props:any) {
        super(props);
        iconTypes.map((tmpIconType:string) => {
            this.data.push({
                value: tmpIconType
            });
        });
    }
    handleOnClick(evt:IElmerEvent): void {
        const data = evt.data.myData;
        typeof this.props.onClick === "function" && this.props.onClick(data);
    }
    handleOnDblClick(evt:IElmerEvent): void {
        const data = evt.data.myData;
        typeof this.props.onDblClick === "function" && this.props.onDblClick(data);
    }
    render(): string {
        return "<ul class='eui-icon-demo'><li et:dblclick='handleOnDblClick' et:click='handleOnClick' em:for='let myData in this.data'><eui-icon type='{{myData.value}}' /><span>{{myData.value}}</span></li></ul>";
    }
}
