import { Component, declareComponent, IPropCheckRule, propTypes } from "elmer-ui-core";
import "./index.less";

@declareComponent({
    selector: "panel"
})
export class PanelComponent extends Component {
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
        },
        hasBottom: <IPropCheckRule>{
            defaultValue: true,
            description: "是否有底部区域",
            rule: propTypes.bool.isRequired
        },
        bottom: <IPropCheckRule>{
            defaultValue: "",
            description: "底部区域html代码",
            rule: propTypes.string.isRequired
        },
        bottomTheme: <IPropCheckRule>{
            defaultValue: "",
            description: "底部区域样式",
            rule: propTypes.string.isRequired
        },
        showBottomProps: <IPropCheckRule>{
            description: "是否打印底部区域传入的props",
            rule: propTypes.bool
        }
    };
    state:any = {
        theme: "",
        title: "",
        hasTitle: "",
        style: "",
        bottomTheme: "",
        hasBottom: true,
    };
    constructor(props:any) {
        super(props);
        this.state.theme = props.theme || "";
        this.state.title = props.title;
        this.state.hasTitle = !this.isEmpty(props.title);
        this.state.style  = !this.isEmpty(props.style) ? props.style : "";
        this.state.hasBottom = props.hasBottom;
        this.state.bottomTheme = props.bottomTheme;
    }
    $onPropsChanged(props:any): void {
        this.setState({
            theme: props.theme,
            title: props.title,
            hasTitle : !this.isEmpty(props.title),
            style: !this.isEmpty(props.style) ? props.style : "",
            hasBottom: props.hasBottom,
            bottomTheme: props.bottomTheme
        });
    }
    render(): string {
        return `<div style="{{state.style}}" class="eui-panel {{state.theme}}" class.eui-panel-has-title="this.state.hasTitle">
                <label em:if="this.state.hasTitle"><span>{{state.title}}</span></label>
                <div><div><content /></div></div>
                <footer class="{{state.bottomTheme}}" em:if="this.state.hasBottom">
                    <eui-run-code em:showProps="this.props.showBottomProps" em:exprops="this.props.props" code="{{props.bottom}}"/>
                </footer>
            </div>`;
    }
}
