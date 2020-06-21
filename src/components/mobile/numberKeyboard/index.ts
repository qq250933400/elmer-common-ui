import {
    Component,
    declareComponent,
    getUI,
    IElmerEvent,
    IPropCheckRule,
    PropTypes
} from "elmer-ui-core";
import "./index.less";

type TypeKeyboardNumberProps = {
    title?: string;
    btnCloseText?: string;
    btnConfirmText?: string;
    copyRight?: string;
    showClose?: boolean;
    showConfirm?: boolean;
    showAnimation?: string;
    hideAnimation?: string;
    visible?: boolean;
    onChange?: Function;
    onClose?: Function;
    onConfirm?: Function;
};

type TypeKeyboardNumberPropsRule = {[P in keyof TypeKeyboardNumberProps]: IPropCheckRule};

@declareComponent({
    selector: "keyboardNumber",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export default class NumberKeyboard extends Component {
    static propType:TypeKeyboardNumberPropsRule = {
        title: {
            description: "Keyboard panel title",
            defaultValue: "",
            rule: PropTypes.string
        },
        btnCloseText: {
            description: "close button title",
            defaultValue: "取消",
            rule: PropTypes.string.isRequired
        },
        btnConfirmText: {
            description: "confirm button title",
            defaultValue: "完成",
            rule: PropTypes.string.isRequired
        },
        copyRight: {
            description: "copyright string",
            defaultValue: "CopyRight ©️ Elmer S J Mo",
            rule: PropTypes.string.isRequired
        },
        showClose: {
            description: "是否显示取消按钮",
            defaultValue: true,
            rule: PropTypes.bool
        },
        showConfirm: {
            description: "是否显示完成按钮",
            defaultValue: true,
            rule: PropTypes.bool
        },
        showAnimation: {
            description: "显示动画键盘样式",
            defaultValue: "showKeyboardAnimation",
            rule: PropTypes.string
        },
        hideAnimation: {
            description: "显示动画键盘样式",
            defaultValue: "hideKeyboardAnimation",
            rule: PropTypes.string
        },
        visible: {
            description: "显示隐藏键盘",
            defaultValue: false,
            rule: PropTypes.bool
        },
        onChange: {
            description: "点击改变事件",
            rule: PropTypes.func
        },
        onClose: {
            description: "键盘隐藏动画结束后触发事件",
            rule: PropTypes.func
        },
        onConfirm: {
            description: "完成按钮点击事件",
            rule: PropTypes.func
        }
    };
    state: any = {
        currentAnimation: ""
    };
    props: TypeKeyboardNumberProps;
    private isConfirmClick: boolean = false;
    private isShowAnimation: boolean;
    private hiddenClassName: string =  "keyBoardHidden";
    constructor(props: TypeKeyboardNumberProps) {
        super(props);
        if(props.visible) {
            this.isShowAnimation = true;
            this.state.currentAnimation = props.showAnimation;
        } else {
            this.isShowAnimation = false;
            this.state.currentAnimation = this.hiddenClassName;
        }
    }
    onConfirm(): void {
        this.isConfirmClick = true;
        this.hide();
    }
    onItemClick(evt:IElmerEvent​​): void {
        typeof this.props.onChange === "function" && this.props.onChange(evt.dataSet.value);
    }
    $onPropsChanged(newProps: TypeKeyboardNumberProps):void {
        if(this.isShowAnimation !== newProps.visible) {
            if(newProps.visible) {
                this.show();
            } else {
                this.hide();
            }
        }
    }
    onAnimationEnd(): void {
        if(this.isShowAnimation) {
            this.setState({
                currentAnimation: ""
            });
        } else {
            this.setState({
                currentAnimation: this.hiddenClassName
            });
            if(this.isConfirmClick) {
                typeof this.onConfirm === "function" && this.onConfirm();
            } else {
                typeof this.props.onClose === "function" && this.props.onClose();
            }
        }
    }
    hide(): void {
        if(this.isShowAnimation) {
            this.isShowAnimation = false;
            this.setState({
                currentAnimation: this.props.hideAnimation
            });
        } else {
            typeof this.props.onClose === "function" && this.props.onClose();
        }
    }
    show(): void {
        this.isShowAnimation = true;
        this.setState({
            currentAnimation: this.props.showAnimation
        });
    }
}

type TypeCreateKeyboardNumberOptions = TypeKeyboardNumberProps & {
    filter?:any;
};
type TypeCreateKeyboardNumberForamtParams = {
    inputValue: string;
    saveValue: string;
    isInit?: boolean;
    cursorPosition?: number;
};
type TypeCreateKeyboardNumberOwner = {
    dispose():void;
    show():void;
    hide():void;
    formatInput(options: TypeCreateKeyboardNumberForamtParams): string;
};

export const createKeyboardNumber = (options:TypeCreateKeyboardNumberOptions): TypeCreateKeyboardNumberOwner => {
    let ui = getUI();
    let isDispose = false;
    let obj = {
        domId: ui.getRandomID(),
        dom:{},
        options,
        onClose: ():void => {
            if(isDispose) {
                uiRender.dispose();
                document.body.removeChild(div);
                uiRender = null;
                obj = null;
                htmlCode = null;
                ui = null;
                div = null;
                owner = null;
            }
        }
    };
    let div = document.createElement("div");
    let owner: TypeCreateKeyboardNumberOwner = {
        dispose(): void {
            isDispose = true;
            obj.dom[obj.domId].hide();
        },
        show():void {
            obj.dom[obj.domId].show();
        },
        hide(): void {
            isDispose = false;
            obj.dom[obj.domId].hide();
        },
        /**
         * 格式化输入内容，获得正确的数字输入文本
         * @param fOptions {TypeCreateKeyboardNumberForamtParams} 控制参数
         * @return string
         */
        formatInput(fOptions: TypeCreateKeyboardNumberForamtParams): string {
            if(fOptions) {
                const saveStr = ui.isEmpty(fOptions.saveValue) ? "" : fOptions.saveValue;
                const inputValue = fOptions.inputValue;
                const saveArr = saveStr.split("");
                let inputResult = "";
                if(inputValue !== "DEL") {
                    if(fOptions.isInit) {
                        if(inputValue !== ".") {
                            if(ui.isNumeric(fOptions.cursorPosition) && fOptions.cursorPosition>=0 && fOptions.cursorPosition<saveArr.length) {
                                saveArr.splice(fOptions.cursorPosition, 0, inputValue);
                            } else {
                                saveArr.push(inputValue);
                            }
                            inputResult = saveArr.join("");
                        }
                    } else {
                        if(inputValue === "." && saveStr.indexOf(inputValue)>=0) {
                            inputResult = saveStr;
                        } else {
                            if(ui.isNumeric(fOptions.cursorPosition) && fOptions.cursorPosition>=0 && fOptions.cursorPosition<saveArr.length) {
                                saveArr.splice(fOptions.cursorPosition, 0, inputValue);
                            } else {
                                saveArr.push(inputValue);
                            }
                            inputResult = saveArr.join("");
                        }
                    }
                } else {
                    inputResult = saveStr.length > 0 ? saveStr.substr(0, saveStr.length - 1) : "";
                }
                if(/^[0]{1,}\./.test(inputResult)) {
                    inputResult = inputResult.replace(/^[0]{1,}\./, "0.");
                } else if(/^[0]{1,}([1-9][0-9\.]*)$/.test(inputResult)) {
                    inputResult = inputResult.replace(/^[0]{1,}([1-9][0-9\.]*)$/, "$1");
                } else if(/^[0]{1,}$/.test(inputResult)) {
                    inputResult = "0";
                } else if(/^\./.test(inputResult)) {
                    inputResult = "0" + inputResult;
                }
                return inputResult;
            } else {
                return "";
            }
        }
    };
    let htmlCode = require("./createKeyboard.html");
    let uiRender = ui.render(div, htmlCode, obj);
    document.body.appendChild(div);
    return owner;
};
