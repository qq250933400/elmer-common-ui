import { autowired ,Component, declareComponent,ElmerDOM, ElmerRender, getUI, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import "./style/form.less";

type AnimationEndType = "ShowForm" | "CloseForm" | "Minimize" | "None" | "Maximize";

export type TypeWinFormProps = {
    bottom: string;
    bottomTheme: string;
    icon: string;
    onClose: Function;
    onMin: Function;
    onMax: Function;
    onFocus: Function;
    showBottom: boolean;
    showBarMax: boolean;
    showBarMin: boolean;
    showBarClose: boolean;
    showIcon: boolean;
    maxBarTheme: string;
    theme: string;
    title: string;
    titleTheme: string;
    width: number;
    height: number;
    visible: boolean;
    zIndex: number;
    position: string;
    emit: Function;
};

type TypeWinFormPropsRule = {[P in keyof TypeWinFormProps]?:IPropCheckRule};

type TypeWinFormState = {
    [P in Exclude<keyof TypeWinFormProps, "position" | "onFocus" | "onClose" | "onMin" | "onMax">]?: any;
} & {
    showAnimation: string;
    hidenAnimation: string;
    minAnimation: string;
    formAnimation: string;
    formStyle: string;
    showForm?: boolean;
    maxTheme?: string;
    mouseX?: number;
    mouseY?: number;
    isMax?:boolean;
    isMoved?:boolean;
    isPressed?: boolean;
    position?: "fixed" | "absolute";
    formLeft?: number;
    formTop?: number;
    formWidth?: number;
    formHeight?: number;
};

@declareComponent({
    selector: "WinForm"
})
export class WinFormComponent extends Component<TypeWinFormProps> {
    static propType: TypeWinFormPropsRule = {
        bottom: {
            defaultValue: "",
            description: "Set html code to form bottom area",
            rule: propTypes.string
        },
        bottomTheme: {
            defaultValue: "",
            description: "Set bottom area theme",
            rule: propTypes.string
        },
        icon: {
            defaultValue: "fa fa-list-alt",
            description: "Set form icon",
            rule: propTypes.string
        },
        maxBarTheme: {
            defaultValue:"elmerDialogFormTitleBarMaxResize",
            description: "maxBar press theme",
            rule: propTypes.string.isRequired
        },
        onClose: {
            description: "form close callback",
            rule: propTypes.func
        },
        onMin: {
            description: "on minBar click",
            rule: propTypes.func
        },
        onMax: {
            description: "on maxBar click",
            rule: propTypes.func
        },
        onFocus: {
            description: "form onfocus",
            rule: propTypes.func
        },
        showBottom: {
            defaultValue: false,
            description: "Set bottom area visible",
            rule: propTypes.bool.isRequired
        },
        showBarMax: {
            defaultValue: true,
            description: "Set BarMax visible",
            rule: propTypes.bool.isRequired
        },
        showBarMin: {
            defaultValue: true,
            description: "Set BarMin visible",
            rule: propTypes.bool.isRequired
        },
        showBarClose: {
            defaultValue: true,
            description: "Set BarClose visible",
            rule: propTypes.bool.isRequired
        },
        showIcon: {
            defaultValue: true,
            description: "Set icon visible",
            rule: propTypes.bool.isRequired
        },
        theme: {
            defaultValue: "",
            description: "Set form theme",
            rule: propTypes.string.isRequired
        },
        title: {
            defaultValue: "WinForm",
            description: "Set title",
            rule: propTypes.string.isRequired
        },
        titleTheme: {
            defaultValue: "",
            description: "Set title theme",
            rule: propTypes.string.isRequired
        },
        width: {
            defaultValue: "auto",
            description: "Set WinForm width",
            rule: propTypes.oneOf([propTypes.number, propTypes.string])
        },
        height: {
            defaultValue: "auto",
            description: "Set WinForm Height",
            rule: propTypes.oneOf([propTypes.number, propTypes.string])
        },
        visible: {
            defaultValue: true,
            description: "Set WinForm Visible",
            rule: propTypes.bool.isRequired
        },
        zIndex: {
            defaultValue: 1,
            description: "Set WinForm zIndex",
            rule: propTypes.number
        },
        position: {
            defaultValue: "absolute",
            description: "position",
            rule: propTypes.oneValueOf(["fixed", "absolute"]).isRequired
        },
        emit: {
            description: "raise event",
            rule: propTypes.func
        }
    };
    state:TypeWinFormState = {
        visible: true,
        showForm: false,
        showAnimation: "AniZoomIn",
        hidenAnimation: "AniZoomOut",
        minAnimation: "AnislideDownOut",
        formAnimation: "",
        formStyle: "opacity: 0;",
        maxTheme: ""
    };
    // ownerID: string = this.getRandomID();
    formID: string = this.getRandomID();
    maxID: string = this.getRandomID();
    titleID: string = this.getRandomID();
    contentID: string = this.getRandomID();
    bottomID: string = this.getRandomID();
    formDom: HTMLElement;
    maxDom: HTMLElement;
    titleDom: HTMLElement;
    contentDom: HTMLElement;
    bottomDom: HTMLElement;
    animationEndType: AnimationEndType = "None";

    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props: any) {
        super(props);
        Object.keys(props).map((pKey: string) => {
            if(props[pKey] !== undefined) {
                this.state[pKey] = props[pKey];
            }
        });
        if(!props.showIcon) {
            this.state.icon = "";
        }
        this.state.formStyle = this.getFormSizeStyle(props.zIndex) + "opacity:0;";
    }
    $onPropsChanged(props:any): void {
        const updateState:any = {};
        for(const key in props) {
            if(!this.isFunction(props[key]) && props[key] !== this.state[key]) {
                updateState[key] = props[key];
            }
        }
        if(!props.showIcon) {
            updateState.icon = "";
        }
        if(this.animationEndType === "None") {
            if(props.visible !== this.state.visible) {
                if(props.visible) {
                    this.animationEndType = "ShowForm";
                    this.setState({
                        ...updateState,
                        visible: props.visible,
                        formAnimation: this.state.showAnimation
                    });
                } else {
                    this.animationEndType = "Minimize";
                    this.setData({
                        ...updateState,
                        visible: props.visible,
                        formAnimation: this.state.hidenAnimation
                    });
                }
                return;
            }
        }
        if(this.state.zIndex !== props.zIndex) {
            if(this.formDom) {
                if(!this.state.isMax) {
                    const nLeft = this.formDom.offsetLeft;
                    const nTop = this.formDom.offsetTop;
                    const formStyle = this.getFormSizeStyle(props.zIndex);
                    this.state.zIndex = props.zIndex;
                    this.setState({
                        ...updateState,
                        formStyle: `left: ${nLeft}px;top:${nTop}px;opacity:1;${formStyle}`
                    });
                } else {
                    this.setState({
                        ...updateState,
                        formStyle: `left: 0;top:0;opacity:1;z-index:${props.zIndex};width:100%;height:100%;`
                    });
                }
            }
        }
    }
    render(): any {
        return require("./views/winForm.html");
    }
    $after(): void {
        this.addEvent(this, document.body, "mousemove", this.onbodyMouseMove.bind(this));
        this.addEvent(this, document.body, "mouseup", this.onbodyMouseUp.bind(this));
    }
    $didMount(): void {
        this.formDom = this.dom[this.formID];
        this.maxDom = this.dom[this.maxID];
        this.titleDom = this.dom[this.titleID];
        this.contentDom = this.dom[this.contentID];
        this.bottomDom = this.dom[this.bottomID];
        this.show();
    }
    onFormClick(): void {
        typeof this.props.onFocus === "function" && this.props.onFocus();
    }
    ontitleBarMouseDown(evt: IElmerEvent): void {
        const thisEvent:any = evt.nativeEvent;
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.state.mouseX = thisEvent.clientX ? thisEvent.clientX :
            (thisEvent.touches ? thisEvent.touches[0].clientX : 0);
        this.state.mouseY = thisEvent.clientY ? thisEvent.clientY :
            (thisEvent.touches ? thisEvent.touches[0].clientY : 0);
        thisEvent.cancelBubble = true;
        if (!this.state.isMax) { this.state.isPressed = true; }
    }
    onMaxClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        const formDom = this.dom[this.formID];
        if (!this.state.isMax && formDom) {
            const formStyle = `left: 0;top:0;opacity:1;z-index:${this.state.zIndex};width:100%;height:100%;${this.state.position};`;
            this.state.formLeft = formDom.offsetLeft;
            this.state.formTop = formDom.offsetTop;
            this.state.formWidth = formDom.clientWidth;
            this.state.formHeight = formDom.clientHeight;
            this.state.isMax = true;
            this.$.css(formDom, {
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
            });
            this.setState({
                maxTheme: this.state.maxBarTheme,
                formStyle
            });
        } else {
            const formSizeStyle = this.getFormSizeStyle();
            const formStyle = `left: ${this.state.formLeft}px;top:${this.state.formTop}px;${formSizeStyle}`;
            this.state.isMax = false;
            this.$.css(formDom, {
                left: this.state.formLeft,
                top: this.state.formTop,
                width: this.state.formWidth,
                height: this.state.formHeight
            });
            this.setState({
                maxTheme: "",
                formStyle
            });
        }
        typeof this.props.onMax === "function" && this.props.onMax(this.state.isMax);
    }
    onMinClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        let formStyle = this.state.formStyle;
        if(this.state.isMax) {
            formStyle = `left:0;top:0;width:100%;height:100%;z-index:${this.state.zIndex};position:${this.state.position};`;
        }
        if (this.$.supportCss3 && !this.isEmpty(this.state.minAnimation)) {
            this.animationEndType = "Minimize";
            this.setState({
                formAnimation: this.state.minAnimation,
                formStyle
            });
        } else {
            this.setState({
                showForm: false,
                visible: false,
                formStyle
            });
            typeof this.props.onMin === "function" && this.props.onMin();
        }
    }
    btnClose(evt:IElmerEvent): void {
        if(evt) {
            evt.nativeEvent.cancelBubble = true;
            evt.nativeEvent.stopPropagation();
        }
        if (this.$.supportCss3 && !this.isEmpty(this.state.hidenAnimation)) {
            this.animationEndType = "CloseForm";
            this.setState({
                formAnimation: this.state.hidenAnimation
            });
        } else {
            this.setState({
                visible: false,
                showFrom: false
            });
            typeof this.props.onClose === "function" && this.props.onClose();
        }
    }
    show(): void {
        if(this.formDom) {
            let left = this.formDom.style.left || "";
            let top = this.formDom.style.top || "";
            left = left.replace(/[a-z\%]*$/i,"");
            top = top.replace(/[a-z\%]*$/i,"");
            if(this.animationEndType === "None") {
                if(!this.isNumeric(left) || !this.isNumeric(top) || this.isEmpty(left) || this.isEmpty(top)) {
                    const mask = this.getOwnerDom();
                    const maskWidth = mask ? mask.clientWidth : null,maskHeight = mask ? mask.clientHeight : null;
                    // 没有设置form的位置，重新定义
                    const frmWidth = this.formDom.clientWidth;
                    const frmHeight = this.formDom.clientHeight;
                    const winWidth = maskWidth || window.innerWidth;
                    const winHeight = maskHeight || window.innerHeight;
                    const nLeft = (winWidth - frmWidth) / 2;
                    const nTop = (winHeight - frmHeight) / 2;
                    const formStyle = this.getFormSizeStyle();
                    this.animationEndType = "ShowForm";
                    this.setState({
                        formStyle: `left: ${nLeft}px;top:${nTop}px;opacity:1;${formStyle}`,
                        formAnimation: this.state.showAnimation
                    });
                } else {
                    this.animationEndType = "ShowForm";
                    this.setState({
                        formAnimation: this.state.showAnimation,
                    });
                }
                this.state.visible = true;
                this.state.showForm = true;
            }
        }
    }
    getOwnerDom(): HTMLElement {
        if(this.state.position === "absolute" && this.formDom) {
            let dom = this.formDom;
            while(dom && dom.parentElement) {
                if(dom.parentElement.style.position !== "relative") {
                    dom = dom.parentElement;
                } else {
                    return dom.parentElement;
                }
            }
            return document.body;
        } else {
            return document.body;
        }
    }
    private formAnimationEnd(): void {
        if(this.animationEndType === "CloseForm") {
            // this.state.isClosing = true;
            this.setState({
                visible: false,
                showFrom: false
            });
            typeof this.props.onClose === "function" && this.props.onClose();
        } else if (this.animationEndType === "Minimize") {
            this.setState({
                visible: false,
                showFrom: false
            });
            typeof this.props.onMin === "function" && this.props.onMin();
        }
        this.animationEndType = "None";
    }
    private onbodyMouseMove(evt: MouseEvent | TouchEvent): void {
        if (this.state.isPressed && this.formDom && !this.state.isMax) {
            const thisEvent = <MouseEvent | TouchEvent>(window.event || evt);
            const posX = (<MouseEvent>thisEvent).clientX ? (<MouseEvent>thisEvent).clientX :
                ((<TouchEvent>thisEvent).touches ? (<TouchEvent>thisEvent).touches[0].clientX : 0);
            const posY = (<MouseEvent>thisEvent).clientY ? (<MouseEvent>thisEvent).clientY :
                ((<TouchEvent>thisEvent).touches ? (<TouchEvent>thisEvent).touches[0].clientY : 0);
            const formDom = this.formDom;
            const formStyle = this.getFormSizeStyle();
            const left = formDom.offsetLeft,
                top = formDom.offsetTop,
                myLeft = left + (posX - this.state.mouseX),
                myTop = top + (posY - this.state.mouseY);
            this.state.mouseX = posX;
            this.state.mouseY = posY;
            this.$.css(formDom, {
                left: myLeft,
                top: myTop
            });
            this.state.formStyle = `left: ${myLeft}px;top:${myTop}px;opacity:1;${formStyle}`;
        }
    }
    private onbodyMouseUp(): void {
        this.state.isPressed = false;
    }
    private getFormSizeStyle(zIndex?:number): string {
        let result = "";
        const pWidth = this.state.width;
        const pHeight = this.state.height;
        if(!this.isEmpty(pWidth)) {
            result = pWidth !== "auto" ? (!isNaN(pWidth) ? `width:${pWidth}px;`: `width:${pWidth};` ) : "";
        }
        if(!this.isEmpty(pHeight)) {
            result += pHeight !== "auto" ? (!isNaN(pHeight) ? `height:${pHeight}px;`: `height:${pHeight};` ) : "";
        }
        if(isNaN(zIndex)) {
            if(!this.isEmpty(this.state.zIndex) && !isNaN(this.state.zIndex)) {
                result += `z-index:${this.state.zIndex};`;
            }
        } else {
            result += `z-index:${zIndex};`;
        }
        if(!this.isEmpty(this.state.position)) {
            result += `position:${this.state.position};`;
        }
        return result;
    }
}
