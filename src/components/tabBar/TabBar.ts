import { Component, declareComponent,IElmerEvent, IPropCheckRule, PropTypes } from "elmer-ui-core";
// tslint:disable-next-line: no-implicit-dependencies
import { IVirtualElement } from "elmer-virtual-dom";
import "./index.less";

type TypeTabBarProps = {
    onChange?: Function;
    onBeforeChange?: Function;
    currentIndex?: number;
    children?: IVirtualElement[];
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
        this.index = index​​;
    }
    handleOnTabClick(evt: IElmerEvent): void {
        const beforeResult = typeof this.props.onBeforeChange === "function" ? this.props.onBeforeChange() : undefined;
        if(beforeResult === undefined || beforeResult) {
            const index = evt.data.myTabTitle.key;
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
                    const domKey = "tabItem_" + index;
                    this.dom[domKey].setData({
                        currentIndex: newProps.currentIndex
                    });
                    index += 1;
                }
            });
        }
        console.log(newProps.currentIndex, this.currentIndex);
    }
}
