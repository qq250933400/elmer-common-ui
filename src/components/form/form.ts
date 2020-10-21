import { autowired, Component, declareComponent, ElmerServiceRequest, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { showToast } from "../toast";

@declareComponent({
    selector: "form"
})
export class FormComponent extends Component {
    static propType:any = {
        action: <IPropCheckRule>{
            description: "发送请求url",
            rule: propTypes.string.isRequired
        },
        method: <IPropCheckRule>{
            defaultValue: "POST",
            description: "请求类型",
            rule: propTypes.string.isRequired
        },
        theme: <IPropCheckRule>{
            defaultValue: "",
            description: "样式",
            rule: propTypes.string
        },
        title: <IPropCheckRule>{
            defaultValue: "Form标题",
            description: "Form标题",
            rule: propTypes.string.isRequired
        },
        hasTitle: <IPropCheckRule>{
            defaultValue: true,
            description: "Form标题",
            rule: propTypes.boolean.isRequired
        },
        submitText: <IPropCheckRule>{
            defaultValue: "提交",
            description: "提交按钮标题",
            rule: propTypes.string
        },
        resetText: <IPropCheckRule>{
            defaultValue: "重置",
            description: "重置按钮标题",
            rule: propTypes.string
        },
        backText: <IPropCheckRule>{
            defaultValue: "返回",
            description: "返回按钮标题",
            rule: propTypes.string.isRequired
        },
        labelWidth: <IPropCheckRule>{
            defaultValue: "100px",
            description: "标签宽度",
            rule: propTypes.string
        },
        inlineMode: <IPropCheckRule>{
            defaultValue: true,
            description: "同一行显示",
            rule: propTypes.boolean
        },
        onSuccess: <IPropCheckRule>{
            description: "调起服务成功",
            rule: propTypes.func
        },
        onFail:<IPropCheckRule>{
            description: "调起服务失败",
            rule: propTypes.func
        },
        onBack: <IPropCheckRule>{
            description: "点击Back按钮事件",
            rule: propTypes.func
        },
        beforeSubmit: <IPropCheckRule> {
            description: "提交数据前执行回调",
            rule: propTypes.func
        },
        backUrl: <IPropCheckRule> {
            defaultValue: "",
            description: "返回按钮地址",
            rule: propTypes.string.isRequired
        },
        showBack:  <IPropCheckRule> {
            defaultValue: false,
            description: "是否显示back按钮",
            rule: propTypes.boolean.isRequired
        },
        showReset:  <IPropCheckRule> {
            defaultValue: false,
            description: "是否显示重置按钮",
            rule: propTypes.boolean.isRequired
        }
    };
    props:any;
    private layoutTheme: string = "eui-form-inline";
    private inlineMode: boolean = false;
    private labelWidth: string = "";
    private itemPaddingLeft: string = "";
    private ajaxLoading: boolean = false;

    @autowired(ElmerServiceRequest)
    private ajax: ElmerServiceRequest;
    constructor(props:any) {
        super(props);
        this.layoutTheme = props.inlineMode ? "eui-form-inline" : "eui-form-block";
        this.inlineMode = props.inlineMode;
        this.labelWidth = "width:" + props.labelWidth + ";";
        this.itemPaddingLeft = "padding-left: " + props.labelWidth + ";";
        this.updateChildrenProps();
    }
    $onPropsChanged(newProps: any): void {
        if(newProps.inlineMode !== this.inlineMode) {
            this.inlineMode = newProps.inlineMode;
            this.layoutTheme = newProps.inlineMode ? "eui-form-inline" : "eui-form-block";
        }
        if(newProps.labelWidth !== this.labelWidth) {
            this.labelWidth = newProps.labelWidth;
            this.itemPaddingLeft = "padding-left: " + newProps.labelWidth + ";";
        }
        this.updateChildrenProps();
        this.setState({},true);
    }
    handleOnBackClick(): void {
        if(typeof this.props.onBack === "function") {
            this.props.onBack();
        } else {
            if(!this.isEmpty(this.props.backUrl)) {
                window.location.href = this.props.backUrl;
            }
        }
    }
    handleOnFormSubmit(evt:IElmerEvent): boolean {
        evt.nativeEvent.preventDefault();
        evt.nativeEvent.stopImmediatePropagation();
        evt.nativeEvent.stopPropagation();
        return false;
    }
    render(): string {
        return require("./views/form.html");
    }
    handleOnBtnSubmit(): void {
        const request:any = {};
        if(/^(http|https)\:\/\//.test(this.props.action) || /^(\.\.\/)|(\.\/)/.test(this.props.action)) {
            request.url = this.props.action;
        } else {
            const NEData = (this.props.action || "").split(".");
            request.namespace = NEData[0];
            request.endPoint = NEData[1];
        }
        const submitData = this.getFormData();
        typeof this.props.beforeSubmit === "function" && this.props.beforeSubmit(submitData);
        this.setData({ajaxLoading: true});
        this.updateChildrenAjaxLoadingStatus();
        this.ajax.sendRequest({
            ...request,
            method: this.props.method,
            data: submitData
        }).then((resp: any) => {
            this.setData({ajaxLoading: false});
            this.updateChildrenAjaxLoadingStatus();
            typeof this.props.onSuccess === "function" && this.props.onSuccess(resp);
        }).catch((err:any) => {
            this.setData({ajaxLoading: false});
            this.updateChildrenAjaxLoadingStatus();
            if(typeof this.props.onFail === "function") {
                this.props.onFail(err);
            } else {
                if(this.isObject(err)) {
                    showToast((<any>err).statusText);
                } else {
                    showToast(err.message);
                }
            }
        });
    }
    handleOnReset(): void {
        if(this.dom && Object.keys(this.dom).length>0) {
            Object.keys(this.dom).map((tmpKey:string) => {
                const tmpChild = this.dom[tmpKey];
                typeof tmpChild.reset === "function" && tmpChild.reset();
            });
        }
    }
    private getFormData(): any {
        const result = {};
        if(this.dom && Object.keys(this.dom).length>0) {
            Object.keys(this.dom).map((tmpKey:string) => {
                const tmpChild = this.dom[tmpKey];
                const tmpData = typeof tmpChild.getData === "function" ? tmpChild.getData() : null;
                if(tmpData) {
                    result[tmpData.name] = tmpData.value;
                }
            });
        }
        return result;
    }
    private updateChildrenAjaxLoadingStatus(): void {
        if(this.dom && Object.keys(this.dom).length>0) {
            Object.keys(this.dom).map((tmpKey:string) => {
                const tmpChild = this.dom[tmpKey];
                delete tmpChild.props.ajaxLoading;
                this.defineReadOnlyProperty(tmpChild.props, "ajaxLoading", this.ajaxLoading);
                typeof tmpChild.$onPropsChanged === "function" && tmpChild.$onPropsChanged(tmpChild.props);
            });
        }
    }
    private setChildenPropsChanged(): void {
        this.updateChildrenProps();
        if(this.dom && Object.keys(this.dom).length>0) {
            Object.keys(this.dom).map((tmpKey:string) => {
                const tmpChild = this.dom[tmpKey];
                delete tmpChild.props.ajaxLoading;
                this.defineReadOnlyProperty(tmpChild.props, "ajaxLoading", this.ajaxLoading);
                typeof tmpChild.$onPropsChanged === "function" && tmpChild.$onPropsChanged(tmpChild.props);
            });
        }
    }
    private updateChildrenProps(): void {
        if(this.props.children && this.props.children.length>0) {
            this.props.children.map((tmpChildren:any, index:number) => {
                if(tmpChildren.tagName === "eui-form-item") {
                    if(this.isEmpty(tmpChildren.props.id)) {
                        const myID = this.getRandomID() + index;
                        tmpChildren.props.id = myID;
                        tmpChildren.props.attach = true;
                    }
                    this.extend(tmpChildren.props, {
                        layoutTheme: this.layoutTheme,
                        labelWidth: this.labelWidth,
                        itemPaddingLeft: this.itemPaddingLeft,
                        ajaxLoading: this.ajaxLoading,
                        tabIndex: index
                    }, true);
                }
            });
        }
    }
}
