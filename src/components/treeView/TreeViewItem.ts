import { autowired, Component, declareComponent, ElmerDOM, IElmerEvent, propTypes } from "elmer-ui-core";
import { ITreeViewItem } from "./index";

type TreeviewItemProps = {
    data:any;
    width: number;
    selectedData: any[];
    onExpandClick: Function;
    dblClick:Function;
    level: number;
    valueKey: string|number;
    click: Function;
    index: any;
    onUpdateChildren: Function;
};

@declareComponent({
    selector: "treeViewItem"
})
export class TreeViewItem extends Component<TreeviewItemProps> {
    static propType: any = {
        width: propTypes.number.isRequired,
        selectedData: propTypes.array,
        onExpandClick:propTypes.func,
        dblClick:propTypes.func,
        level: {
            defaultValue: 0,
            description: "level",
            rule: propTypes.number
        },
        valueKey: {
            defaultValue: "value",
            description: "value字段名",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        click: {
            description: "单击事件",
            rule: propTypes.func
        },
        index: {
            description: "数组索引",
            rule: propTypes.any
        },
        onUpdateChildren: {
            description: "更新Item事件",
            rule: propTypes.func
        }
    };
    public listWidth: string = "auto";
    public settingWidth: boolean = false;
    public hasChild: boolean = false;
    public expandIcon: string = "fa-angle-right";
    public hasIcon: boolean = false;
    public icon: string;
    public subLevel: number = 0;
    public space: number = 0;

    private data: ITreeViewItem;
    private expand: boolean = false;
    private treeViewItemClick: Function;
    private theme: string = "";
    private level: number = 0;
    private offsetLeft: number = 0;
    private expandDom: HTMLElement;
    private width: number = 0;
    private childrenMaxWidth: number = 0;
    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props: any) {
        super(props);
        this.data = JSON.parse(JSON.stringify(props.data));
        this.data.children = (<any>(this.data.children || []));
        this.hasChild = this.data.hasExpand ? this.data.hasExpand : (this.data && this.data.children.length>0);
        this.hasIcon = !this.isEmpty(this.data.icon);
        this.icon = this.data.icon;
        this.theme = !this.isEmpty(props.theme) ? props.theme : "";
        this.theme = [this.theme, this.getCheckStatusTheme()].join(" ");
        this.subLevel = this.props.level + 1;
        this.space = this.props.level * 20;
        this.offsetLeft = this.props.level * 20;
        this.data.theme = !this.isEmpty(this.data.theme) ? this.data.theme : "";
    }
    getCheckStatusTheme(): string {
        if(this.props.selectedData) {
            const checkField = !this.isEmpty(this.props.valueKey) ? this.props.valueKey : "value";
            for(const item of this.props.selectedData) {
                if(item[checkField] === this.data[checkField]) {
                    return "eui-treeview-item-selected";
                }
            }
        }
        return "";
    }
    $onPropsChanged(newProps: any): void {
        const cTheme = this.getCheckStatusTheme();
        const cArray = (this.theme||"").split(" ");
        const newData = newProps.data || {};
        if(!this.isEmpty(cTheme)) {
            if(cArray.indexOf("eui-treeview-item-selected")<0) {
                cArray.push("eui-treeview-item-selected");
            }
        } else {
            const tIndex = cArray.indexOf("eui-treeview-item-selected");
            if(tIndex>=0) {
                cArray.splice(tIndex,1);
            }
        }
        newData.children = newData.children || [];
        newData.theme = !this.isEmpty(newData.theme) ? newData.theme : "";
        this.setData({
            width: newProps.width,
            theme: cArray.join(" "),
            data: newProps.data || {}
        });
    }
    handleOnExpandClick(event:IElmerEvent): boolean {
        const newExpand: boolean = !this.expand;
        const updateData: any = {
            expand: newExpand,
            expandIcon: newExpand ? "fa-angle-down" : "fa-angle-right"
        };
        this.expandDom = event.target;
        if(typeof this.props.onExpandClick ==="function") {
            const resultExpand = this.props.onExpandClick({
                expand:newExpand,
                data: this.data,
                setData: this.updateData.bind(this),
                setChildren: this.updateChildren.bind(this)
            });
            updateData.expand = resultExpand;
            updateData.expandIcon = resultExpand ? "fa-angle-down" : "fa-angle-right";
        }
        this.setData(updateData);
        event.nativeEvent.cancelBubble = true;
        event.nativeEvent.stopPropagation();
        event.nativeEvent.preventDefault();
        return false;
    }
    updateData(data: any): void {
        if(JSON.stringify(data.children) !== JSON.stringify(this.data.children)) {
            data.children = data.children || [];
            typeof this.props.onUpdateChildren === "function" && this.props.onUpdateChildren(this.props.index, data);
        }
        data.theme = !this.isEmpty(data.theme) ? data.theme : "";
        this.setData({
            ...(data||{})
        }, true);
        if(JSON.stringify(data.data||{}) !== JSON.stringify(this.data)) {
            typeof this.props.onUpdateChildren === "function" && this.props.onUpdateChildren(this.props.index, this.data);
        }
    }
    updateChildren(data: any): void {
        const newData = this.data;
        newData.children = data || [];
        this.props.data.children = data;
        this.setData({
            data: newData
        }, true);
        if(JSON.stringify(data) !== JSON.stringify(this.data.children)) {
            typeof this.props.onUpdateChildren === "function" && this.props.onUpdateChildren(this.props.index, this.data);
        }
    }
    $didMount(): void {
       if(this.expand) {
           // 未展开子元素时无法获取元素宽度，只有在展开后做判断;
            const parent = this.expandDom.parentElement.parentElement;
            const childrens = this.$.find(parent, "+ul>li>div>label span");
            const width = this.getMaxWidth(childrens);
            if(this.childrenMaxWidth !== width && childrens && childrens.length>0) {
                const childrenLeft:any = childrens[0].getAttribute("data-left");
                const offsetLeft = !isNaN(childrenLeft) ? parseInt(childrenLeft, 10) : 0;
                if(width + offsetLeft> this.width) {
                    const updateWidth = width + this.offsetLeft;
                    if(updateWidth > this.width) {
                        const updateDoms = this.$.find(parent, "+ul>li");
                        this.$.css(updateDoms,"width", updateWidth);
                    }
                }
            }
            this.width = width;
       }
    }
    handleOnClick(evt:any): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        evt.nativeEvent.preventDefault();
        evt.data = this.data;
        evt.setData = this.setData.bind(this);
        this.isFunction(this.props.click) && this.props.click(evt, this.data);
    }
    handleOnDblClick(evt:any): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        evt.nativeEvent.preventDefault();
        evt.data = this.data;
        evt.setData = this.updateData.bind(this);
        this.isFunction(this.props.dblClick) && this.props.dblClick(evt);
    }
    render(): string {
        return require("./views/treeViewItem.html");
    }
    handleOnListUpdateChildren(data: any): void {
        this.data.children = data;
    }
    private getMaxWidth(domList:HTMLElement[]): number {
        let maxWidth = 0;
        if(domList) {
            domList.map((tmpDom:HTMLElement) => {
                let tmpWidth = tmpDom.clientWidth+tmpDom.offsetLeft+20;
                if(tmpWidth>maxWidth) {
                    maxWidth = tmpWidth;
                }
                tmpWidth = null;
            });
        }
        return maxWidth;
    }
}
