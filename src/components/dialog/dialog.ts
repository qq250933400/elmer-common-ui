import { StaticCommon } from "elmer-common";
import { defineGlobalVar, ElmerRender, getUI, IElmerEvent } from "elmer-ui-core";
import { IComponent } from "elmer-ui-core/lib/interface/IComponent";
import { TypeWinFormProps } from "./WinForm";

export type TypeCreateDialogFormAttrs = {
    [P in Exclude<keyof TypeWinFormProps, "position" | "onClose"| "onMin" | "onMax" | "onFocus">]?: any;
} & {
    events?:any;
};

export type TypeCreateDailogOptions = {
    parent?:HTMLElement;
    options?: TypeCreateDialogFormAttrs & {
        position?: "absolute" | "fixed";
        data?: any;
    };
    htmlCode?: string;
    showMask?:boolean;
    attrs?: any;
    onClose?:Function;
    onMin?:Function;
    onMax?: Function;
    onFocus?: Function;
};

export type TypeCreateDialogResult = {
    render?:ElmerRender;
    component?: IComponent;
    options?: any;
    zIndex?: number;
    hide?:Function;
    setZIndex?(index:number,visible?: boolean):void;
    show?(options?: TypeCreateDailogOptions): void;
};
export const createDialog = (options:TypeCreateDailogOptions): TypeCreateDialogResult => {
    let ui = getUI();
    let cOptions:TypeCreateDailogOptions = {
        options: {
            visible: true
        },
        htmlCode: ""
    };
    let parent:HTMLElement;
    ui.extend(cOptions, options);
    const result:TypeCreateDialogResult = {
        options: cOptions.options,
        // tslint:disable-next-line: object-literal-shorthand
        show: function(updateOptions?: TypeCreateDailogOptions):void {
            let cParams:TypeCreateDialogFormAttrs = JSON.parse(JSON.stringify(this.options));
            cParams.visible = true;
            if(options) {
                this.component.extend(cParams, updateOptions.options);
            }
            this.component.setData({
                options: cParams
            });
            cParams = null;
        },
        // tslint:disable-next-line: object-literal-shorthand
        hide: function(): void {
            let cParams:TypeCreateDialogFormAttrs = JSON.parse(JSON.stringify(this.options));
            cParams.visible = false;
            this.component.setData({
                options: cParams
            });
            cParams = null;
        },
        // tslint:disable-next-line: object-literal-shorthand typedef
        setZIndex: function(index:number, visible?: boolean) {
            let cParams:TypeCreateDialogFormAttrs = JSON.parse(JSON.stringify(this.options));
            cParams.zIndex = index;
            if(visible !== undefined && visible !== null) {
                cParams.visible = visible;
            }
            this.component.setData({
                options: cParams
            });
            this.zIndex = index;
            cParams = null;
        }
    };
    const dialogOwner = {
        options: ui.extend(cOptions.options, options.options),
        renderObj: null,
        container: parent,
        formID: ui.getRandomID(),
        removeFromContent: true,
        demoID: ui.getRandomID(),
        // tslint:disable-next-line: object-literal-shorthand
        onClose : function():void {
            const closeCallBack = this.myEvents.onClose;
            const exData = this.attrs;
            if(!this.removeFromContent) {
                if(this.container && this.container.parentElement) {
                    this.container.parentElement.removeChild(this.container);
                }
            } else {
                const lContainer = this.isDOM(this.dom[this.formID]) ? this.dom[this.formID] : this.dom[this.formID].formDom;
                if(lContainer.parentElement) {
                    lContainer.parentElement.removeChild(lContainer);
                } else {
                    // tslint:disable-next-line: no-console
                    console.error("Get wrong object to do the delete action");
                }
            }
            this.renderObj.dispose();
            this.renderObj = null;
            Object.keys(result).map((tmpKey) => {
                delete result[tmpKey];
            });
            delete this.renderObj;
            delete this.container;
            delete this.myEvents;
            delete this.attrs;
            typeof closeCallBack === "function" && closeCallBack(exData);
        },
        // tslint:disable-next-line: object-literal-shorthand
        onMin : function():void {
            let cParams:TypeCreateDialogFormAttrs = JSON.parse(JSON.stringify(this.options));
            cParams.visible = false;
            this.setData({
                options: cParams
            });
            cParams = null;
            typeof this.myEvents.onMin === "function" && this.myEvents.onMin(this.attrs);
        },
        // tslint:disable-next-line: object-literal-shorthand
        onMax : function(isMax:boolean):void {
            typeof this.myEvents.onMax === "function" && this.myEvents.onMax(isMax, this.attrs);
        },
        // tslint:disable-next-line: object-literal-shorthand
        onFocus: function(): void {
            typeof this.myEvents.onFocus === "function" && this.myEvents.onFocus(this.attrs);
        },
        // tslint:disable-next-line: object-literal-shorthand
        close: function(): void {
            const formObj = this.dom[this.formID];
            const formObj2 = this.dom[this.demoID];
            if(formObj2) {
                formObj2.btnClose();
            } else {
                formObj.btnClose();
            }
        }
    };
    if(ui.isDOM(cOptions.parent)) {
        parent = cOptions.parent;
        dialogOwner.removeFromContent = true;
    } else {
        parent = document.createElement("div");
        cOptions.options.position = "fixed";
        dialogOwner.removeFromContent = false;
        document.body.appendChild(parent);
    }
    dialogOwner.container = parent;
    (<any>dialogOwner).myEvents = {
        onClose: cOptions.onClose,
        onMax: cOptions.onMax,
        onMin: cOptions.onMin,
        onFocus: cOptions.onFocus
    };
    (<any>dialogOwner).attrs = cOptions.attrs;
    // -----------------------Check if hasMaxk
    let htmlCode = `<eui-win-form id="{{formID}}" et:onFocus="onFocus" et:onMax="onMax" et:onMin="onMin" et:onClose="onClose" ...="{{options}}" attrs="{{attrs}}" et:emit="options.emit">${cOptions.htmlCode}</eui-win-form>`;
    if(cOptions.showMask) {
        htmlCode = `<div id="{{formID}}" et:onFocus="onFocus" em:show='this.options.visible' class='elmerDialog'>
            <div><eui-win-form id="{{demoID}}" et:emit="options.emit" attrs="{{attrs}}" et:onMax="onMax" et:onMin="onMin" et:onClose="onClose" ...="{{options}}">
                <ChildrenWrapperContent>${cOptions.htmlCode}</ChildrenWrapperContent>
                <ChildrenWrapperBottom>${cOptions.options.bottom}</ChildrenWrapperBottom>
            </eui-win-form></div></div>`;
    }
    // -----------------------
    result.render = ui.render(parent, htmlCode, dialogOwner);
    result.component = <any>dialogOwner;
    result.options = cOptions.options;
    result.zIndex = cOptions.options.zIndex;
    dialogOwner.renderObj = result.render;
    ui = null;
    cOptions =  null;
    return result;
};
// ------------------Define Input dialog
export interface IDialogInputBeforeEvent extends IElmerEvent {
    cancel?: boolean;
    value?: any;
}

export type TypeDialogInputOptions = {
    title?: string
    okText?: string;
    cancelText?: string;
    defaultValue?: string | number;
    placeHolder?: string;
    zIndex?: number;
    onOk?(value?: string): void;
    onCancel?(): void;
    onBefore?(evt?: IDialogInputBeforeEvent): void;
};

export const showInput = (options:TypeDialogInputOptions) => {
    const config:TypeDialogInputOptions = {
        title: "输入框",
        placeHolder: "请输入",
        okText: "确定",
        cancelText: "取消",
        defaultValue: "",
        zIndex: 1000
    };
    let isConfirm = false;
    let inputValue = "";
    StaticCommon.extend(config, options);
    return createDialog({
        showMask: true,
        options: {
            title: config.title,
            zIndex: config.zIndex,
            showBarMax: false,
            showBarMin: false,
            showIcon: false,
            showBottom: true,
            bottom: `<button evt:click='props.emit' class='alert-yes'>${config.okText}</button><button evt:click='props.emit' class='alert-no'>${config.cancelText}</button>`,
            bottomTheme: "elmerAlertTwoButton elmerAlertButton",
            // tslint:disable-next-line:object-literal-shorthand
            emit: function(evt:IElmerEvent): void {
                if(evt.target.tagName === "BUTTON") {
                    isConfirm = /alert\-yes/i.test(evt.target.className);
                    if(isConfirm) {
                        if(typeof config.onBefore === "function") {
                            const exEvent:IDialogInputBeforeEvent = {
                                ...evt,
                                cancel: false,
                                value: inputValue
                            };
                            config.onBefore(exEvent);
                            if(exEvent.cancel) {
                                return;
                            }
                        }
                    }
                    this.close();
                } else if(evt.target.tagName === "INPUT") {
                    inputValue = (<HTMLInputElement>evt.target).value;
                }
            }
        },
        htmlCode: `<div style="padding: 20px 10px;"><input et:keyup="options.emit" type='text' class='eui-input' placeholder="${config.placeHolder}"/></div>`,
        onClose: () => {
            if(isConfirm) {
                typeof config.onOk === "function" && config.onOk(inputValue);
            } else {
                typeof config.onCancel === "function" && config.onCancel();
            }
        }
    });
};
// ----eAlert
export type TypeEnumAlertIcon = "Alert" | "Error" | "Information" | "Question" | "Success" | "Warning";
export type TypeEnumAlertMsg = "OKOnly" | "OkCancel" | "OkCancelRetry" | "YesOnly" | "YesNo" | "YesNoRetry";
export type TypeEnumAlertButton = "Ok" | "Cancel" | "Retry" | "None";
export type TypeOnAlertBeforeEvent = {
    button: TypeEnumAlertButton;
    cancel: boolean;
};
export type TypeAlertOptions = {
    title?: string;
    message?: string;
    content?: string;
    msgType?: TypeEnumAlertMsg;
    iconType?: TypeEnumAlertIcon;
    icon?: string;
    showTipIcon?: boolean;
    okText?: string;
    okTheme?: string;
    cancelText?: string;
    cancelTheme?: string;
    retryText?: string;
    retryTheme?: string;
    theme?: string;
    zIndex?: number;
    isMobile?: boolean;
    events?: any;
    onOk?(): void;
    onCancel?(): void;
    onRetry?(): void;
    onBefore?(event:TypeOnAlertBeforeEvent): void;
};
export const eAlert = (options:TypeAlertOptions) => {
    const config:TypeAlertOptions = {
        message: "",
        okText: "确定",
        cancelText: "取消",
        retryText: "重试",
        okTheme: "eui-button-primary",
        cancelTheme: "",
        retryTheme: "",
        zIndex: 1000,
        showTipIcon: true
    };
    StaticCommon.extend(config, options);
    const noTipTheme = !config.showTipIcon ? "elmerAlertNoTipIcon" : "";
    let bottomCode = "";
    let bottomTheme = "";
    let choseButton: "Ok" | "Cancel" | "Retry" | "None" = "None";
    if((config.msgType === "OKOnly" || config.msgType === "YesOnly")) {
        bottomCode = `<button evt:click='options.emit' class='alert-yes ${config.okTheme}'>${config.okText}</button>`;
        bottomTheme = "elmerAlertOneButton";
    } else if (["OkCancel", "YesNo"].indexOf(config.msgType)>-1) {
        bottomCode = `<button evt:click='options.emit' class='alert-yes ${config.okTheme}'>${config.okText}</button><button evt:click='options.emit' class='alert-no ${config.cancelTheme}'>${config.cancelText}</button>`;
        bottomTheme = "elmerAlertTwoButton";
    } else if(["OkCancelRetry","YesNoRetry"].indexOf(config.msgType)> -1) {
        bottomCode = `<button evt:click='options.emit' class='alert-yes ${config.okTheme}'>${config.okText}</button><button evt:click='options.emit' class='alert-no ${config.cancelTheme}'>${config.cancelText}</button><button evt:click='props.emit' class='alert-try ${config.retryTheme}'>${config.retryText}</button>`;
        bottomTheme = "elmerAlertThreeButton";
    } else {
        bottomCode = `<button evt:click='options.emit' class='alert-yes ${config.okTheme}'>${config.okText}</button>`;
        bottomTheme = "elmerAlertOneButton";
    }
    bottomTheme = "elmerAlertButton " + bottomTheme;

    return createDialog({
        showMask: true,
        options: {
            title: config.title || "提示",
            showBottom: true,
            showIcon: false,
            showBarMin: false,
            showBarMax: false,
            bottomTheme,
            bottom: bottomCode,
            zIndex: config.zIndex,
            theme: (config.iconType || "") + " eui-Alert " + (config.isMobile ? "eui-Alert-mobile" : ""),
            visible: true,
            events: config.events,
            // tslint:disable-next-line:object-literal-shorthand only-arrow-functions
            emit: function(evt:IElmerEvent): void {
                let button = evt.target;
                let clickButton:TypeEnumAlertButton = "None";
                const beforeEvent:TypeOnAlertBeforeEvent = {
                    button: "None",
                    cancel: false
                };
                if(/alert\-yes/.test(button.className)) {
                    choseButton = "Ok";
                    clickButton = "Ok";
                } else if(/alert\-no/.test(button.className)) {
                    choseButton = "Cancel";
                    clickButton = "Cancel";
                } else if(/alert\-try/.test(button.className)) {
                    choseButton = "Retry";
                    clickButton = "Retry";
                } else {
                    choseButton = "Cancel";
                    clickButton = "Cancel";
                }
                button = null;
                if(typeof config.onBefore === "function") {
                    beforeEvent.button = clickButton;
                    config.onBefore(beforeEvent);
                }
                if(!beforeEvent.cancel) {
                    this.close();
                }
            }
        },
        htmlCode: StaticCommon.isEmpty(config.content) ? `<div class="elmerAlertContent ${noTipTheme}"><div>${config.message}</div></div>` : config.content,
        onClose: () => {
            if(choseButton === "Ok") {
                typeof config.onOk === "function" && config.onOk();
            } else if(choseButton === "Cancel") {
                typeof config.onCancel === "function" && config.onCancel();
            } else if(choseButton === "Retry") {
                typeof config.onRetry === "function" && config.onRetry();
            } else {
                typeof config.onCancel === "function" && config.onCancel();
            }
        }
    });
};

if(!window["eAlert"]) {
    defineGlobalVar("eAlert", eAlert);
}

export default {
    open: createDialog,
    input: showInput,
    alert: eAlert
};
