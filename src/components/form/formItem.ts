import { Component, declareComponent, IElmerBindEvent, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { EnumFormItemTypes } from "./emunFormData";

@declareComponent({
    selector: "formItem"
})
export class FormItemComponent extends Component {
    static propType: any = {
        id: <IPropCheckRule> {
            description: "组件ID",
            rule: propTypes.string
        },
        name: <IPropCheckRule> {
            description: "组件Name",
            rule: propTypes.string.isRequired
        },
        title: <IPropCheckRule> {
            defaultValue: "",
            description: "标题",
            rule: propTypes.string
        },
        placeholder: <IPropCheckRule> {
            defaultValue: "",
            description: "PlaceHolder",
            rule: propTypes.string
        },
        theme: <IPropCheckRule>{
            defaultValue: "",
            description: "样式",
            rule: propTypes.string
        },
        labelWidth: <IPropCheckRule>{
            defaultValue: "width:100px;",
            description: "标签宽度",
            rule: propTypes.string
        },
        layoutTheme: <IPropCheckRule>{
            defaultValue: "",
            description: "样式",
            rule: propTypes.string.isRequired
        },
        itemPaddingLeft: <IPropCheckRule>{
            defaultValue: "padding-left:100px;",
            description: "标签宽度",
            rule: propTypes.string.isRequired
        },
        type: <IPropCheckRule>{
            defaultValue: EnumFormItemTypes.Input,
            description: "组件类型",
            rule: propTypes.oneValueOf(Object.keys(EnumFormItemTypes)).isRequired
        },
        ajaxLoading: <IPropCheckRule>{
            defaultValue: false,
            description: "form是否正在请求",
            rule: propTypes.boolean
        },
        value: <IPropCheckRule>{
            defaultValue: "",
            description: "默认值",
            rule: propTypes.any
        },
        data: <IPropCheckRule> {
            defaultValue: {},
            description: "扩展参数",
            rule: propTypes.any
        },
        tabIndex: <IPropCheckRule> {
            defaultValue: 0,
            description: "tabIndex",
            rule: propTypes.number
        },
        zIndex: <IPropCheckRule> {
            defaultValue: 0,
            description: "tabIndex",
            rule: propTypes.number
        },
        onChange: <IPropCheckRule> {
            description: "部分组件值修改触发事件",
            rule: propTypes.func
        }
    };
    state: any = {
        value: null,
        calendarStyle: "position:fixed;display:none;",
        startDate: "",
        endDate: "",
        showStartDate: false,
        itemStyle: ""
    };
    props:any;
    private ajaxLoading: boolean = false;
    private domID: string = this.getRandomID();
    private ue: any = null;
    private labelWidth: string = "width: 100px;";
    private itemPaddingLeft: string = "padding-left: 100px;";
    private regionData: any[] = [];
    constructor(props:any) {
        super(props);
        this.ajaxLoading = props.ajaxLoading;
        this.state.value = props.value;
        this.labelWidth = props.labelWidth;
        this.itemPaddingLeft = props.itemPaddingLeft;
        if(this.props.zIndex > 0) {
            this.state.itemStyle = `z-index: ${props.zIndex};`;
        }
        if(props.type === EnumFormItemTypes.DatePeriod || props.type === EnumFormItemTypes.Date) {
            if(this.isObject(props.value)) {
                this.state.startDate = props.value.startDate || "";
                this.state.endDate = props.value.endDate || "";
            } else {
                const cArr = (props.value || "").split("|");
                if(cArr.length>0) {
                    this.state.startDate = cArr[0] || "";
                }
                if(cArr.length>1) {
                    this.state.endDate = cArr[1] || "";
                }
            }
        }
    }
    $onPropsChanged(newProps:any): void {
        if(newProps.ajaxLoading !== this.ajaxLoading) {
            if(this.props.type === EnumFormItemTypes.Editor && this.ue) {
                if(newProps.ajaxLoading) {
                    this.ue.setDisabled("fullscreen");
                } else {
                    this.ue.setEnabled();
                }
            }
        }
        this.state.value = newProps.value;
        this.setData({
            ajaxLoading: newProps.ajaxLoading
        }, true);
    }
    beforeInputChange(evt:IElmerBindEvent): void {
        typeof this.props && this.props.onChange === "function" && this.props.onChange({
            id: this.props.id,
            name: this.props.name,
            data: evt.value
        });
        return evt.value;
    }
    getData(): any {
        let myValue = this.state.value;
        if(this.props.type === EnumFormItemTypes.Editor && this.ue) {
            myValue = this.ue.getContent();
        } else if([ EnumFormItemTypes.Upload, EnumFormItemTypes.PcRegion, EnumFormItemTypes.DropDown].indexOf(this.props.type)>=0) {
            myValue = this.dom[this.domID].getData();
        } else if([EnumFormItemTypes.Input, EnumFormItemTypes.Password, EnumFormItemTypes.TextArea].indexOf(this.props.type)>=0) {
            myValue = this.dom[this.domID].value;
        } else if(this.props.type === EnumFormItemTypes.DatePeriod) {
            myValue = {
                startDate: this.state.startDate,
                endDate: this.state.endDate
            };
        } else if(this.props.type === EnumFormItemTypes.Date) {
            myValue = this.state.startDate;
        }
        return {
            name: this.props.name,
            value: myValue
        };
    }
    handleOnStartDateClick(evt:IElmerEvent): void {
        const target = evt.target;
        const rect = target.getBoundingClientRect();
        const left = rect.left,top = rect.bottom;
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            showStartDate: true,
            calendarDefaultValue: [this.state.startDate],
            calendarStyle: `display:block;position:fixed;left:${left}px;top:${top}px;z-index:10000;`
        });
    }
    handleOnEndDateClick(evt:IElmerEvent): void {
        const target = evt.target;
        const rect = target.getBoundingClientRect();
        const left = rect.left,top = rect.bottom;
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            showStartDate: false,
            calendarDefaultValue: [this.state.endDate],
            calendarStyle: `display:block;position:fixed;left:${left}px;top:${top}px;z-index:10000;`
        });
    }
    handleOnCalendarChange(data:string[]): void {
        if(this.state.showStartDate) {
            this.setState({
                startDate: data[0] || "",
                calendarStyle: "display:none;"
            });
        } else {
            this.setState({
                endDate: data[0] || "",
                calendarStyle: "display:none;"
            });
        }
        typeof this.props.onChange === "function" && this.props.onChange({
            id: this.props.id,
            name: this.props.name,
            isStartDate: this.state.showStartDate,
            data
        });
    }
    handleOnCalendarOutClick(): void {
        this.setState({
            calendarStyle: "display:none;"
        });
    }
    handleOnDropdownChanged(itemData:any): void {
        this.setState({
            value: itemData.value,
            title: itemData.title
        });
        typeof this.props.onChange === "function" && this.props.onChange({
            id: this.props.id,
            name: this.props.name,
            data: {
                value: itemData.value,
                title: itemData.title
            }
        });
    }
    handleOnPcRegionChange(regionData: any[]): void {
        this.regionData = regionData;
        typeof this.props.onChange === "function" && this.props.onChange({
            id: this.props.id,
            name: this.props.name,
            data: regionData
        });
    }
    render(): string {
        if(this.props.type !== EnumFormItemTypes.Hidden) {
            return require("./views/formItem.html");
        } else {
            return "";
        }
    }
    reset(): void {
        this.props.value = "";
        this.setState({value:""}, true);
        if(this.props.type === EnumFormItemTypes.Editor) {
            if(this.ue) {
                this.ue.setContent("");
            }
        } else if([EnumFormItemTypes.DropDown, EnumFormItemTypes.PcRegion, EnumFormItemTypes.Upload].indexOf(this.props.type)>=0) {
            this.dom[this.domID].reset();
        }
    }
    $after(): void {
        if(this.props.type === EnumFormItemTypes.Editor && !this.ue) {
            if(UM) {
                const config:any = {};
                if(this.props.data && this.props.data.toolbars) {
                    config.toolbars = this.props.data.toolbars;
                }
                this.ue = UM.getEditor(this.domID, config);
                if(this.isObject(this.props.data) && !this.isEmpty(this.props.data.height)) {
                    this.ue.setHeight(this.props.data.height);
                }
                this.ue.setContent(this.state.value || "");
            } else {
                // tslint:disable-next-line:no-console
                console.error("请在header引用UEditor插件");
            }
        }
    }
}
