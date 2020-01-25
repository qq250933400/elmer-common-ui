import { defineGlobalState, defineGlobalVar, ElmerUI } from "elmer-ui-core";

export * from "./Toast";

const setTostState = (stateKey: string, stateValue:any) => {
    elmerData.elmerState.toastGlobalData[stateKey] = stateValue;
};
const getTostState = (stateKey:string): any => {
    return elmerData.elmerState.toastGlobalData ? elmerData.elmerState.toastGlobalData[stateKey] : null;
};
export interface IToastOption {
    autoClose?: boolean;
    elmerRender?: object|null;
    theme?: string;
    icon?: "Error" | "Success" | "None";
    onClose?: Function;
    duration?: number;
    showAnimation?: string;
    closeAnimation?: string;
    visible?: boolean;
    timeVisible?: boolean;
    iconVisible?: boolean;
    zIndex?: number;
}

export const showToast = (message: string, exOptions?: IToastOption) => {

    const options = exOptions || {};
    const ui: any = elmerData.getUI();
    const exOption:IToastOption =  {
        duration: 5,
        iconVisible: true,
        timeVisible: true,
        visible: true,
        zIndex: 10001,
        autoClose: true
    };
    const iconThemes:any = {
        Error: "eui-toast-error",
        Success: "eui-toast-msg-success",
        None: "themeNoIcon"
    };
    const target = getTostState("target") || document.createElement("div");
    const hasAppend = /^(\[object\s*)HTML([a-zA-Z]*)(Element\])$/.test(Object.prototype.toString.call(getTostState("target")));

    ui.extend(exOption, options);
    if(!ui.isEmpty(exOption.icon)) {
        exOption.icon = iconThemes[exOption.icon];
    }
    if(!elmerData.elmerState.toastGlobalData) {
        // ---------
        defineGlobalState("toastGlobalData", {
            messages: [],
            render: null,
            target: null,
            title:"toast弹窗数据"
        });
    }
    if(!getTostState("render")) {
        setTostState("render", ui);
    }
    if(!hasAppend) {
        target.className = "eui-toast-msg-list";
        target.style.zIndex = exOption.zIndex;
        document.body.appendChild(target);
        setTostState("target", target);
    }
    const parent = document.createElement("div");
    target.appendChild(parent);
    let uiRender = ui.render(parent, "<eui-toast style='position:relative;{{options.zIndex}}' message='{{message}}' handler='{{id}}' et:onClose='onClose' "+
        "autoClose='{{autoClose}}' closeAnimation='{{closeAnimation}}' showAnimation='{{showAnimation}}' " +
        "duration='{{duration}}' icon='{{icon}}' theme='{{theme}}' iconVisible='{{options.iconVisible}}' timeVisible='{{options.timeVisible}}'" +
        "/>", {
            autoClose: exOption.autoClose,
            closeAnimation: exOption.closeAnimation,
            duration: exOption.duration,
            icon: exOption.icon,
            id: ui.getRandomID(),
            message,
            options: exOption,
            selector: "eui-toast-msg",
            showAnimation: exOption.showAnimation,
            theme: exOption.theme,
            visible: exOption.visible,
            // tslint:disable-next-line:object-literal-sort-keys
            // tslint:disable-next-line:object-literal-shorthand
            // tslint:disable-next-line:typedef
            onClose: () => {
                parent.parentElement.removeChild(parent);
                uiRender.dispose();
                uiRender = null;
                typeof exOption.onClose === "function" && exOption.onClose();
            }
        }
    );

};

/**
 * 挂载变量到windows下，其他位置可以直接调用
 */
defineGlobalVar("showToast", showToast);
