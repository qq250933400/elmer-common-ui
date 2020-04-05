import {
    Component,
    declareComponent,
    IElmerEvent,
    IPropCheckRule,
    propTypes
} from "elmer-ui-core";
import "./style.less";

type TypeDropDownPropsCheckRule = {
    id: IPropCheckRule;
    name: IPropCheckRule;
    disabled: IPropCheckRule;
    theme: IPropCheckRule;
    value: IPropCheckRule;
    data: IPropCheckRule;
    placeholder: IPropCheckRule;
    tabIndex: IPropCheckRule;
    onChanged?: IPropCheckRule;
    onChange: IPropCheckRule;
    style: IPropCheckRule;
    showValue: IPropCheckRule;
};
type TypeDropDownProps = {[P in keyof TypeDropDownPropsCheckRule]: any};
@declareComponent({
    selector: "dropDown"
})
export class ElmerDropDown extends Component {
    static propType: TypeDropDownPropsCheckRule = {
        id: <IPropCheckRule> {
            description: "组件ID",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        name: <IPropCheckRule> {
            description: "组件name",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        disabled: <IPropCheckRule> {
            defaultValue: false,
            description: "是否禁止",
            rule: propTypes.boolean
        },
        theme: <IPropCheckRule> {
            defaultValue: "",
            description: "样式",
            rule: propTypes.string
        },
        value: <IPropCheckRule>{
            defaultValue: "",
            description: "默认值",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        data: <IPropCheckRule> {
            defaultValue: [],
            description: "列表数据",
            rule: propTypes.array.isRequired
        },
        placeholder: <IPropCheckRule> {
            defaultValue: "",
            description: "placeholder",
            rule: propTypes.string
        },
        tabIndex: <IPropCheckRule> {
            defaultValue: 0,
            description: "tabIndex",
            rule: propTypes.number.isRequired
        },
        onChanged:<IPropCheckRule> {
            description: "Change事件,即将弃用的方法",
            rule: propTypes.func
        },
        onChange: <IPropCheckRule> {
            description: "Change事件",
            rule: propTypes.func
        },
        style: <IPropCheckRule> {
            description: "内联样式",
            rule: propTypes.string
        },
        showValue: {
            defaultValue: false,
            description: "是否显示value值在title后面",
            rule: propTypes.bool
        }
    };
    state: any = {
        titleVisible: false,
        dropListVisible: false,
        hasFocus: false,
        title: "",
        selectedData: {value: ""},
        dataList: [],
        style: ""
    };
    props: TypeDropDownProps;
    constructor(props:TypeDropDownProps) {
        super(props);
        this.state.dataList = props.data || [];
        this.state.style = props.style || "";
        if(!this.isEmpty(props.value)) {
            const listData = props.data || [];
            for(const tmpData of listData) {
                if(tmpData.value === props.value) {
                    this.state.titleVisible = true;
                    this.state.title = tmpData.title;
                    this.state.selectedData = tmpData;
                    break;
                }
            }
        }
    }
    getData(): any {
        return this.state.selectedData;
    }
    reset(): any {
        this.setState({
            titleVisible: false,
            title: "",
            selectedData: null
        }, true);
    }
    checkIconVisible(itemData: any): string {
        let visibleClassName = itemData && this.isEmpty(itemData.icon) ? "eui-inline-hidden" : "eui-inline-block";
        if(itemData && !this.isEmpty(itemData.theme)) {
            visibleClassName += " " + itemData.theme;
        }
        return visibleClassName;
    }
    handleOnBlur(): void {
        this.setState({
            dropListVisible: false,
            hasFocus: false,
        });
    }
    handleOnClick(): void {
        if(!this.props.disabled) {
            this.setState({
                dropListVisible: !this.state.dropListVisible,
                hasFocus: true
            });
        }
    }
    handleOnListClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
    }
    handleOnListItemClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        if(!evt.data.item.disabled) {
            this.setState({
                titleVisible: true,
                dropListVisible: false,
                selectedData: evt.data.item,
                title: evt.data.item.title
            });
            typeof this.props.onChanged === "function" && this.props.onChanged(evt.data.item, {
                id: this.props.id,
                name: this.props.name
            });
            typeof this.props.onChange === "function" && this.props.onChange(evt.data.item, {
                id: this.props.id,
                name: this.props.name
            });
        }
    }
    $onPropsChanged(props: any): void {
        const listData = props.data || [];
        const updateState:any = {
            dataList: props.data || [],
            style: props.style || ""
        };
        for(const tmpData of listData) {
            if(tmpData.value === props.value) {
                updateState.titleVisible = true;
                updateState.title = tmpData.title;
                updateState.selectedData = tmpData;
                break;
            }
        }
        this.setState(updateState);
    }
    render(): string {
        return require("./index.html");
    }
}
