import { Component, declareComponent,IElmerEvent, IPropCheckRule, PropTypes } from "elmer-ui-core";
// tslint:disable-next-line: no-implicit-dependencies
import { IVirtualElement } from "elmer-virtual-dom";
import "./index.less";

type TypeTabBarProps = {
    onChange?: Function;
    onBeforeChange?: Function;
    currentIndex?: number;
    children?: IVirtualElement[];
    visible?: boolean;
};

type TypeTabBarPropsRule = {[P in keyof TypeTabBarProps]: IPropCheckRule};

@declareComponent({
    selector: "tab"
})
export class TabBar extends Component {
    static propType:TypeTabBarPropsRule ={
        onChange: <IPropCheckRule> {
            defaultValue: null,
            description: "tab切换事件",
            rule: PropTypes.func
        },
        onBeforeChange: {
            description: "切换事件前回调",
            rule: PropTypes.func
        },
        currentIndex: <IPropCheckRule> {
            defaultValue: 0,
            rule: PropTypes.number.isRequired
        },
        visible: <IPropCheckRule> {
            rule: PropTypes.bool
        }
    };
    index: number = 0;
    tabTitle: any[] = [];
    currentIndex: any = 0;
    props: TypeTabBarProps;
    constructor(props: any) {
        super(props);
        this.currentIndex = this.props.currentIndex;
    }
    getChildContext():any {
        return {
            tabStore: {
                tabIndex: this.currentIndex
            }
        };
    }
    setIndex(index:number): void {
        this.index = index;
    }
    handleOnTabClick(evt: IElmerEvent): void {
        const index = evt.data.myTabTitle.key;
        const beforeResult = typeof this.props.onBeforeChange === "function" ? this.props.onBeforeChange(index) : undefined;
        if(beforeResult === undefined || beforeResult) {
            this.setData({
                currentIndex: index
            }, true);
            typeof this.props.onChange === "function" && this.props.onChange(index);
        }
    }
    render(): string {
        return require("./views/tabBar.html");
    }
    $before(): void {
        const tabData = [];
        let index = 0;
        this.props.children.map((item:IVirtualElement) => {
            if(item.tagName === "eui-tab-item") {
                if(item.props.visible === undefined || item.props.visible) {
                    item.props.index = index;
                    item.props.currentIndex = this.currentIndex;
                    item.props.id = "tabItem_" + index;
                    item.props.attach = true;
                    tabData.push({
                        index,
                        title: item.props.title
                    });
                    index += 1;
                }
            }
        });
        this.tabTitle = tabData;
    }
    $onPropsChanged(newProps:any): void {
        if(newProps.currentIndex !== this.currentIndex) {
            this.setData({
                currentIndex: newProps.currentIndex
            });
            let index = 0;
            this.props.children.map((item:IVirtualElement) => {
                if(item.tagName === "eui-tab-item") {
                    if(item.props.visible === undefined || item.props.visible) {
                        const domKey = "tabItem_" + index;
                        this.dom[domKey].setCurrentIndex(newProps.currentIndex);
                        index += 1;
                    }
                }
            });
        }
    }
    switchTab(tabIndex: number): void {
        let index = 0;
        this.setData({
            currentIndex: tabIndex
        });
        this.props.children.map((item:IVirtualElement) => {
            if(item.tagName === "eui-tab-item") {
                if(item.props.visible === undefined || item.props.visible) {
                    const domKey = "tabItem_" + index;
                    this.dom[domKey].setCurrentIndex(tabIndex);
                    index += 1;
                }
            }
        });
    }
}
