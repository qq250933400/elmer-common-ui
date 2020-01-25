import { Component, declareComponent, IPropCheckRule, propTypes } from "elmer-ui-core";
import "./index.less";

@declareComponent({
    selector: "section"
})
export class SectionComponent extends Component {
    static propType:any = {
        theme: <IPropCheckRule>{
            description: "样式",
            rule: propTypes.string
        },
        style: <IPropCheckRule>{
            description: "样式",
            rule: propTypes.string
        },
        title: <IPropCheckRule>{
            description: "标题",
            rule: propTypes.string
        }
    };
    state:any = {
        theme: "",
        title: "",
        hasTitle: "",
        style: ""
    };
    constructor(props:any) {
        super(props);
        this.state.theme = props.theme || "";
        this.state.style  = !this.isEmpty(props.style) ? props.style : "";
    }
    $onPropsChanged(props:any): void {
        this.setState({
            theme: props.theme,
            style: !this.isEmpty(props.style) ? props.style : ""
        });
    }
    render(): string {
        return `<div style="{{state.style}}" class="eui-section {{state.theme}}">
                <div><content /></div>
            </div>`;
    }
}
