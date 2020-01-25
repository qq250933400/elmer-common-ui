import { Component, declareComponent,IPropCheckRule, propTypes } from "elmer-ui-core";

@declareComponent({
    selector: "tabItem"
})
export class TabBarItem extends Component {
    static propType: any = {
        title: <IPropCheckRule> {
            defaultValue: "tabItem",
            description: "tab标签标题",
            rule: propTypes.oneOf([propTypes.string, propTypes.number]).isRequired
        },
        currentIndex: <IPropCheckRule> {
            defaultValue: 0,
            description: "当前选择的tab页",
            rule: propTypes.number
        }
    };
    currentIndex: number = 0;
    index: number = 0;
    private title: string = "tab标签标题";
    constructor(props:any) {
        super(props);
        this.title = props.title;
        this.currentIndex = props.currentIndex;
        this.index = props.index;
    }
    $onPropsChanged(newProps:any): void {
        this.setData({
            title: newProps.title,
            currentIndex: newProps.currentIndex
        });
    }
    render(): string {
        return require("./views/tabBarItem.html");
    }
}
