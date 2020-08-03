import { Component, declareComponent, IPropCheckRule, PropTypes } from "elmer-ui-core";
import "./index.less";

type TypeOfficeSplitLayoutProps = {
    leftTitle?: string;
    rightTitle?: string;
    onLayoutChange?: Function;
};

type TypeOfficeSplitLayoutPropRule = {[P in keyof TypeOfficeSplitLayoutProps]: IPropCheckRule};

@declareComponent({
    selector: "office-split-layout"
})
export default class OfficeSplitLayout extends Component {
    static propType: TypeOfficeSplitLayoutPropRule = {
        leftTitle: {
            defaultValue: "菜单管理",
            description: "左侧面板标题",
            rule: PropTypes.string.isRequired
        },
        rightTitle: {
            defaultValue: "显示内容",
            description: "右侧区域标题",
            rule: PropTypes.string.isRequired
        }
    };
    state:any = {
        hideLeft: false,
        leftTitle: "",
        rightTitle: ""
    };
    props: TypeOfficeSplitLayoutProps;
    constructor(props:TypeOfficeSplitLayoutProps) {
        super(props);
        this.state.leftTitle = props.leftTitle;
        this.state.rightTitle = props.rightTitle;
    }
    $onPropsChanged(props: TypeOfficeSplitLayoutProps): void {
        this.setState({
            leftTitle: props.leftTitle,
            rightTitle: props.rightTitle
        });
    }
    handleOnShowHideClick(): void {
        this.setState({
            hideLeft: !this.state.hideLeft
        });
        typeof this.props.onLayoutChange === "function" && this.props.onLayoutChange();
    }
    render():any {
        return require("./index.html");
    }
}
