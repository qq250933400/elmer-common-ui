import { Component, declareComponent, getUI,IPropCheckRule, propTypes } from "elmer-ui-core";
import "./loadingIcon";
import "./style.less";

export type TypeLoadingTypes = "style1" | "style2" | "style3" | "style4" | "style5" | "style6" | "style7" | "style8";

export type TypeLoadingPropsRule = {
    percent: IPropCheckRule;
    title: IPropCheckRule;
    type: IPropCheckRule;
    titleVisible: IPropCheckRule;
    visible: IPropCheckRule;
};

@declareComponent({
    selector: "Loading"
})
export class Loading extends Component {
    static propType: TypeLoadingPropsRule = {
        percent: <IPropCheckRule>{
            description: "进度",
            rule: propTypes.number
        },
        title: <IPropCheckRule>{
            defaultValue: "loading",
            description: "标题",
            rule: propTypes.string.isRequired
        },
        type: <IPropCheckRule>{
            defaultValue: "style1",
            description: "icon样式",
            rule: propTypes.string.isRequired
        },
        titleVisible: <IPropCheckRule>{
            defaultValue: true,
            description: "是否显示标题",
            rule: propTypes.bool.isRequired
        },
        visible: {
            defaultValue: true,
            description: "显示Loading",
            rule: propTypes.bool.isRequired
        }
    };
    private type: TypeLoadingTypes = "style1";
    private style1Visible: boolean = true;
    private style2Visible: boolean = false;
    private style3Visible: boolean = false;
    private style4Visible: boolean = false;
    private style5Visible: boolean = false;
    private style6Visible: boolean = false;
    private style7Visible: boolean = false;
    private style8Visible: boolean = false;
    private visible: boolean = true;
    private title: string = "loading";
    private titleVisible:boolean = true;
    constructor(props: any) {
        super(props);
        this.type = props.type || "style1";
        this.visible = props.visible;
        this.title = props.title || "loading";
        this.titleVisible = props.titleVisible;
        this.style1Visible = false;
        this[`${this.type}Visible`] = true;
    }
    $onPropsChanged(newProps: any): void {
        const updateState: any = {};
        if(!this.isEmpty(newProps.visible)) {
            updateState.visible = newProps.visible;
        }
        if(!this.isEmpty(newProps.titleVisible)) {
            updateState.titleVisible = newProps.titleVisible;
        }
        if(!this.isEmpty(newProps.title)) {
            updateState.title = newProps.title;
        }
        if(!this.isEmpty(newProps.type)) {
            this[`${newProps.type}Visible`] = true;
        }
        this.setData(updateState);
    }
    render(): string {
        return require("./index.html");
    }
}
export type TypeShowLoadingOptions = {
    type?: TypeLoadingTypes;
    showTitle?: boolean;
    title?: string;
    visible?: boolean;
};
export type TypeShowloadingResult = {
    show?(): void;
    hide?(): void;
    dispose?(): void;
    setTitle?(title: string): void;
};
export const showLoading = (options: TypeShowLoadingOptions): TypeShowloadingResult => {
    let config:TypeShowLoadingOptions = {
        type: "style2",
        title: "Loading...",
        showTitle: true,
        visible: true
    };
    let ui = getUI();
    let obj:any = {
        options: null
    };
    let parent = document.createElement("div");
    ui.extend(config, options);
    obj.options = config;
    let objRender = ui.render(parent, "<eui-loading titleVisible='{{options.showTitle}}' title='{{options.title}}' type='{{options.type}}' visible='{{options.visible}}'/>", obj);
    document.body.appendChild(parent);
    return {
        show: (): void => {
            const cp:TypeShowLoadingOptions = JSON.parse(JSON.stringify(config));
            cp.visible = true;
            obj.setData({options: cp});
        },
        hide: (): void => {
            const cp:TypeShowLoadingOptions = JSON.parse(JSON.stringify(config));
            cp.visible = false;
            obj.setData({options: cp});
        },
        dispose: (): void => {
            objRender.dispose();
            parent && parent.parentElement && parent.parentElement.removeChild(parent);
            parent = null;
            objRender = null;
            obj = null;
            ui  = null;
            config = null;
        },
        setTitle: (title: string): void => {
            const cp:TypeShowLoadingOptions = JSON.parse(JSON.stringify(config));
            cp.title = title;
            obj.setData({
                options: cp
            });
        }
    };
};

elmerData["showLoading"] = showLoading;
