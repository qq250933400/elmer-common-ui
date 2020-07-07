import { Component, declareComponent,IPropCheckRule, PropTypes } from "elmer-ui-core";

@declareComponent({
    selector: "tabItem"
})
export class TabBarItem extends Component {
    static propType: any = {
        title: <IPropCheckRule> {
            defaultValue: "tabItem",
            description: "tab标签标题",
            rule: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired
        },
        currentIndex: <IPropCheckRule> {
            defaultValue: -1,
            description: "当前选择的tab页",
            rule: PropTypes.number
        }
    };
    static contextType:any = {
        tabStore: PropTypes.object
    };
    currentIndex: number = 0;
    index: number = 0;
    private title: string = "tab标签标题";
    constructor(props:any, context:any) {
        super(props, context);
        this.title = props.title;
        this.currentIndex = props.currentIndex >= 0 ? props.currentIndex : 0;
        this.index = props.index;
    }
    setIndex(index:number): void {
        this.index = index;
    }
    setCurrentIndex(index:number): void {
        if(index !== this.currentIndex) {
            this.setData({
                currentIndex: index
            });
            this.mountPage();
        }
    }
    $contextChange(context:any, oldContext:any): void {
        const storeIndex = this.getValue(context, "tabStore.tabIndex");
        const oldStoreIndex = this.getValue(oldContext, "tabStore.tabIndex");
        if(storeIndex !== oldStoreIndex) {
            this.setData({
                currentIndex: storeIndex
            });
            this.mountPage();
        }
    }
    render(): string {
        return require("./views/tabBarItem.html");
    }
    private mountPage():void {
        if(this.dom) {
            // tslint:disable-next-line: forin
            for(const key in this.dom) {
                typeof this.dom[key].$didMount === "function" && this.dom[key].$didMount();
            }
        }
    }
}
