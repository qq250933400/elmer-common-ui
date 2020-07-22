import { Component, declareComponent, IElmerEvent, IPropCheckRule, PropTypes } from "elmer-ui-core";
import "./index.less";

type TypeCheckProps = {
    title?: string;
    checked?: boolean;
    showTitle?: boolean;
    className?: string;
    onChange?: Function;
};

type TypeCheckPropsRule = {[P in keyof TypeCheckProps]: IPropCheckRule};

@declareComponent({
    selector: "checkbox"
})
export default class Checkbox extends Component {
    static propType: TypeCheckPropsRule = {
        title: {
            description: "标题",
            rule: PropTypes.string
        },
        checked: {
            description: "是否选中",
            defaultValue: true,
            rule: PropTypes.bool
        },
        showTitle: {
            description: "是否显示标题",
            defaultValue: true,
            rule: PropTypes.bool
        },
        className: {
            description: "样式",
            defaultValue: "",
            rule: PropTypes.string
        },
        onChange: {
            description: "状态改变事件",
            rule: PropTypes.func
        }
    };
    state: any = {
        checked: false,
        showTitle: false,
        title: "",
        className: ""
    };
    props: TypeCheckProps;
    constructor(props:TypeCheckProps) {
        super(props);
        this.state.checked = props.checked;
        this.state.showTitle = props.showTitle;
        this.state.title = props.title;
        this.state.className = props.className;
    }
    $onPropsChanged(props:TypeCheckProps): void {
        this.setState({
            checked: props.checked,
            title: props.title,
            showTitle: props.showTitle,
            className: props.className
        });
    }
    onCheckedChange(evt:IElmerEvent​​): void {
        const input:HTMLInputElement = <any>evt.target;
        const checkedValue = input.checked;
        this.setState({
            checked: checkedValue
        });
        const dataSet = {};
        Object.keys(this.props).map((attrKey) => {
            if(/^data\-/i.test(attrKey)) {
                const dataKeyValue = attrKey.replace(/^data\-/i, "");
                dataSet[dataKeyValue] = this.props[attrKey];
            }
        });
        typeof this.props.onChange === "function" && this.props.onChange({
            checked: checkedValue,
            data:dataSet
        });
    }
    render(): any {
        return require("./index.html");
    }
}
