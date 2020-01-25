import { Component, declareComponent, IPropCheckRule, propTypes } from "elmer-ui-core";
import "./index.less";

@declareComponent({
    selector: "toast"
})
export class Toast extends Component {
    static propType:any = {
        autoClose: propTypes.boolean,
        closeAnimation: <IPropCheckRule>{
            defaultValue: "AnislideDownOut",
            description: "关闭动画",
            rule: propTypes.string.isRequired
        },
        duration: <IPropCheckRule>{
            defaultValue: 6,
            description: "自动关闭时间",
            rule:  propTypes.number.isRequired
        },
        handler: propTypes.any,
        // tslint:disable-next-line:no-object-literal-type-assertion
        iconVisible: <IPropCheckRule>{
            defaultValue: true,
            description: "icon是否显示",
            rule: propTypes.boolean,
        },
        leftTime: propTypes.number,
        message: <IPropCheckRule>{
            defaultValue: "",
            description: "消息内容",
            rule:  propTypes.oneOf([propTypes.string, propTypes.number]).isRequired
        },
        onClose: propTypes.func,
        showAnimation: <IPropCheckRule>{
            defaultValue: "AnislideDownIn",
            description: "显示动画",
            rule: propTypes.string.isRequired
        },
        // tslint:disable-next-line:no-object-literal-type-assertion
        style: (<IPropCheckRule>{
            defaultValue: "",
            description: "组件内联样式",
            propertyKey: "style",
            rule: propTypes.string
        }),
        theme: <IPropCheckRule>{
            defaultValue: "",
            description: "样式",
            rule: propTypes.string.isRequired
        },
        // tslint:disable-next-line:no-object-literal-type-assertion
        timeVisible: <IPropCheckRule> {
            defaultValue: true,
            description: "是否显示倒计时",
            rule: propTypes.boolean
        },
        visible: <IPropCheckRule>{
            defaultValue: false,
            description: "显示隐藏",
            rule: propTypes.boolean
        },
        icon: <IPropCheckRule>{
            defaultValue: "eui-toast-error",
            description: "图标",
            rule: propTypes.string.isRequired
        }
    };
    message: string = "";
    icon: string = "eui-toast-error";
    curAnimation: string = "AnislideDownIn";
    private closeAnimation: string = "AnislideDownOut";
    private showAnimation: string = "AnislideDownIn";
    private theme: string = "";
    private leftTime: number = 5;
    private duration: number = 5;
    private timeTick: boolean = false;
    private canTick: boolean = true;
    private showVisible: boolean = true;
    private cid: string = this.getRandomID();
    private onClose: Function = null;
    private autoClose: boolean = true;
    private toClose: boolean = false;
    constructor(props:any) {
        super(props);
        this.onClose = props.onClose;
        this.autoClose = props.autoClose;
        this.icon = props.icon;
        this.duration = props.duration;
        this.showAnimation = props.showAnimation;
        this.closeAnimation = props.closeAnimation;
        this.message = props.message;
        this.showVisible = props.visible;
        this.canTick = this.autoClose;
        this.icon = this.props.iconVisible ? this.icon : "noIcon";
        this.theme = props.theme;
        this.theme = this.props.iconVisible ? this.theme : this.theme + " themeNoIcon";
    }
    $onPropsChanged(newProps:any): void {
        if(newProps.autoClose !== this.autoClose) {
            this.autoClose = newProps.autoClose;
        }

        if(newProps.visible !== this.showVisible) {
            if(!this.showVisible && newProps.visible) {
                this.leftTime = this.duration;
                this.canTick = false;
                this.setData({
                    closeAnimation: newProps.closeAnimation,
                    curAnimation: this.showAnimation,
                    icon: this.props.iconVisible ? newProps.icon : "noIcon",
                    leftTime: this.duration,
                    message: newProps.message,
                    showAnimation: newProps.showAnimation,
                    showVisible: true,
                    theme: newProps.iconVisible ? newProps.theme : newProps.theme + " themeNoIcon",
                    toClose: false
                });
                this.autoClose && this.timeTickFunc();
            }
        } else {
            this.setData({
                closeAnimation: newProps.closeAnimation,
                curAnimation: this.showAnimation,
                duration: this.duration,
                icon: newProps.icon,
                message: newProps.message,
                showAnimation: newProps.showAnimation,
                theme: newProps.theme
            });
        }
    }
    timeTickFunc(): void {
        if(this.leftTime>1) {
            const updateStatus = {
                leftTime: this.leftTime - 1,
                timeTick: true
            };
            this.setData(updateStatus);
            setTimeout(this.timeTickFunc.bind(this), 1000);
        } else {
            this.setData({
                curAnimation: this.closeAnimation,
                toClose: true,
            });
        }
    }
    handleOnDomAnimationEnd(): void {
        if(this.toClose) {
            this.setData({
                showVisible: false
            });
            this.isFunction(this.onClose) && this.onClose(this.props.handler);
        }
    }
    $after(): void {
        if(!this.timeTick && this.canTick) {
            this.leftTime = this.duration;
            this.canTick = false;
            this.setData({
                leftTime: this.duration,
                showVisible: true
            });
            this.timeTickFunc();
        } else {
            this.setData({
                showVisible: true
            });
        }
    }
    handleOnClose(): void {
        this.setData({
            curAnimation: this.closeAnimation,
            toClose: true,
        });
    }
    render(): string {
        return "<div show='{{showVisible}}' style='{{style}}' class='eui-toast-msg {{theme}}'><div id='{{cid}}' et:animationEnd='handleOnDomAnimationEnd' class='{{curAnimation}}'><div class='fa {{icon}}'><span>{{message}}</span><i if='{{autoClose}}'>({{leftTime}}s)</i></div><a em:if='!this.autoClose' class='fa fa-times-circle' evt:click='handleOnClose' href='javascript:void(0);'></a></div></div>";
    }
}
