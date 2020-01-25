import { Component, declareComponent,IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { IVirtualElement } from "elmer-virtual-dom";
import "./index.less";

@declareComponent({
    selector: "tab"
})
export class TabBar extends Component {
    static propType:any ={
        onChange: <IPropCheckRule> {
            defaultValue: null,
            description: "tab切换事件",
            rule: propTypes.func
        }
    };
    private tabTitle: any[] = [];
    private currentIndex: any = 0;
    constructor(props: any) {
        super(props);
        const initData = this.initChildren(props, this.currentIndex);
        this.tabTitle = initData.tabTitle;
        delete this.props.children;
        this.props.children = initData.children;
    }
    $onPropsChanged(newProps: any): void {
        const initData = this.initChildren(newProps, this.currentIndex);
        this.setData({
            ...initData
        });
    }
    handleOnTabClick(evt: IElmerEvent): void {
        const index = evt.data.myTabTitle.key;
        // for(let i=0;i<this.props.children.length;i++) {
        //     this.props.children[i].props.currentIndex = index;
        // }
        this.setData({
            currentIndex: index
        }, true);
        typeof this.props.onChange === "function" && this.props.onChange(index);
    }
    render(): string {
        return require("./views/tabBar.html");
    }
    private initChildren(props:any, selectedIndex: number): any {
        const children = props ? (props.children || []) : [];
        const tabTitle = [];
        const contentChildren = [];
        let index = 0;
        // tslint:disable-next-line:forin
        for(let key = 0;key<children.length;key++) {
            const tmpChild:IVirtualElement = children[key];
            if(tmpChild.tagName === "eui-tab-item") {
                const tmpTitle = tmpChild.props["title"];
                if(this.isEmpty(tmpTitle)) {
                    throw new Error(`eui-tab子元素[${key}]设置错误eui-tab-item的title属性不能为空！`);
                } else {
                    tabTitle.push({
                        title: tmpTitle
                    });
                    this.extend(tmpChild.props, {
                        currentIndex: selectedIndex,
                        index,
                    }, true);
                    contentChildren.push(tmpChild);
                }
                index += 1;
            }
        }
        return {
            tabTitle,
            children: contentChildren
        };
    }
}
