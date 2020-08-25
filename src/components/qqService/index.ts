import { Component, declareComponent, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { ElmerUI } from "elmer-ui-core/lib/core/ElmerUI";
import "./index.less";

type QQServiceProps = {
    data: any[];
    workTime: string;
    workTitle: string;
    onClick: Function;
    theme: string;
}

@declareComponent({
    selector: "qqservice"
})
export class QQService extends Component<QQServiceProps> {
    static propType: any = {
        data: <IPropCheckRule>{
            defaultValue: [
                {title: "在线客服", items: [
                    { title: "企业QQ交谈1",tipTitle:"QQ:", value:"1234567", icon: "qq_icon" },
                    { title: "企业QQ交谈2",tipTitle:"QQ:", value:"1234568", icon: "qq_icon" },
                    { title: "企业QQ交谈3",tipTitle:"QQ:", value:"1234569", icon: "qq_icon" }
                ]},
                {title: "技术支持", items: [
                    { title: "250933400",tipTitle:"QQ:", value:"250933400", icon: "qq_icon" },
                    { title: "250933400",tipTitle:"QQ:", value:"250933400", icon: "qq_icon" },
                    { title: "250933400",tipTitle:"QQ:", value:"250933400", icon: "qq_icon" }
                ]},
            ],
            description: "数据",
            rule: propTypes.array.isRequired
        },
        workTime: <IPropCheckRule>{
            defaultValue: "9:00-24:00",
            description: "工作时间",
            rule: propTypes.string.isRequired
        },
        workTitle: <IPropCheckRule>{
            defaultValue: "在线时间：",
            description: "工作时间标题",
            rule: propTypes.string.isRequired
        },
        onClick: <IPropCheckRule>{
            description: "点击事件",
            rule: propTypes.func
        },
        theme: <IPropCheckRule>{
            defaultValue: "",
            description: "样式",
            rule: propTypes.string
        }
    };
    selectGroup: any;
    showList: boolean = false;
    data: IQQServiceData[] = [];
    constructor(props: any) {
        super(props);
        if(props.data && props.data.length>0) {
            this.selectGroup = props.data[0];
        }
        this.data = props.data || [];
    }
    handleOnTabClick(): void {
        this.setData({
            showList: !this.showList
        });
    }
    handleOnGroupClick(evt:IElmerEvent): void {
        this.setData({
            selectGroup: evt.data.item
        });
    }
    handleOnItemClick(evt:IElmerEvent): void {
        typeof this.props.onClick === "function" && this.props.onClick(evt.data.tmpItem);
    }
    render(): string {
        return require("./index.html");
    }
    $onPropsChanged(props:any): void {
        this.setData({
            data: props.data || []
        });
    }
}

export interface IQQServiceDataItem {
    title: string;
    tipTitle?: string;
    value: any;
}
export interface IQQServiceData {
    title?: string;
    items?: IQQServiceDataItem[];
}
export interface IQQServiceOptions {
    data?: IQQServiceData[];
    onClick?: Function;
    workTime?: string;
    workTitle?: string;
    theme?: string;
}

export const attachQQService = (options?: IQQServiceOptions) => {
    const defaultOptions: IQQServiceOptions = {
        data: null,
        theme: ""
    };
    const ui:ElmerUI = elmerData.getUI();
    ui.extend(defaultOptions, options);
    const dom = document.createElement("div");
    dom.setAttribute("style", "display: block;height:0;");
    document.body.appendChild(dom);
    ui.render(dom, "<eui-qqservice et:onClick='onClick' em:data='this.data' workTime='{{workTime}}' workTitle='{{workTitle}}' theme='{{theme}}'/>", {
        ...defaultOptions
    });
};

window["attachQQService"] = attachQQService;
