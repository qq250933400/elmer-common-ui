import { Component, declareComponent, propTypes } from "elmer-ui-core";
import { ITreeViewItem } from "./index";

@declareComponent({
    selector: "treeViewList"
})
export class TreeViewList extends Component {
    static propType: any = {
        data: propTypes.array.isRequired,
        fixedWidth: propTypes.string,
        level: propTypes.number,
        width: propTypes.number.isRequired,
        selectedData: propTypes.array,
        onItemDblClick: propTypes.func,
        onExpandClick: propTypes.func,
        treeViewItemClick: propTypes.func,
        valueKey: {
            defaultValue: "value",
            description: "value字段名",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        onUpdateChildren: {
            description: "更新Item事件",
            rule: propTypes.func
        }
    };
    public selectedData: any = [];
    public display: string = "none";
    public treeViewItemClick: Function;
    public treeViewItemDblClick: Function;
    public level: number = 0;
    public space: number = 0;
    private data: ITreeViewItem[] = [];
    private show: boolean;
    private width: number = 0;
    constructor(props: any) {
        super(props);
        const myData: ITreeViewItem[] = props.data || [];
        const hasChildData = [];
        const noChildData = [];
        myData.map((tmpData: ITreeViewItem)=> {
            if(tmpData && tmpData.children && tmpData.children.length>0) {
                hasChildData.push(tmpData);
            } else {
                noChildData.push(tmpData);
            }
        });
        // this.data = [...hasChildData, ...noChildData];
        this.data = props.data || [];
        this.selectedData = props.selectedData;
        if(props.firstChild === "firstChild") {
            this.display = "block";
            this.show = true;
        }
        this.level = props.level;
        this.treeViewItemDblClick = props.onItemDblClick;
    }
    handleOnUpdateChildren(index: any, data:any): void {
        if(index>=0 && index< this.data.length) {
            this.data[index] = data;
            typeof this.props.onUpdateChildren === "function" && this.props.onUpdateChildren(this.data);
        }
    }
    $onPropsChanged(newProps: any): void {
        const updateProps: any = {};
        let hasChanged = false;
        if(newProps !== this.show && newProps.firstChild !== "firstChild") {
            hasChanged = true;
            updateProps.display = newProps.show ? "block" : "none";
            updateProps.show = newProps.show;
        }
        if(newProps.width>0 && this.width<=0) {
            hasChanged = true;
            updateProps.width = newProps.width;
        }
        if(newProps.fixedWidth !== "auto" && !this.isEmpty(newProps.fixedWidth)) {
            hasChanged = true;
            updateProps.fixedWidth = newProps.fixedWidth;
        }
        if(JSON.stringify(newProps.data) !== JSON.stringify(this.data)) {
            updateProps.data = newProps.data;
        }
        updateProps.selectedData = newProps.selectedData;
        this.setData(updateProps, true);
    }
    render(): string {
        return require("./views/treeViewList.html");
    }
}
