import { autowired, Component, declareComponent, ElmerDOM, IElmerEvent, propTypes } from "elmer-ui-core";
import "./styles/index.less";
import "./TreeViewItem";
import "./TreeViewList";

export interface ITreeViewItem {
    title: string;
    id?: string;
    icon?: string;
    children: ITreeViewItem[];
    data?: any;
    hasExpand?: boolean;
    key?: number;
    theme?: string;
}

@declareComponent({
    selector: "treeView",
    template: {
        url: "./views/index.html",
        fromLoader: true
    }
})
export class TreeView extends Component {
    static propType: any = {
        data: propTypes.array,
        onChange: propTypes.func,
        onExpandClick: propTypes.func,
        changeOnDblClick: {
            defaultValue: true,
            description: "chang事件是否在双击事件",
            rule: propTypes.boolean
        },
        isMutil: {
            defaultValue: false,
            description: "是否可多选",
            rule: propTypes.boolean
        },
        valueKey: {
            defaultValue: "value",
            description: "value字段名",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        }
    };
    public data: ITreeViewItem[] = [];
    public level: number = 0;
    private containerWidth: number = 0;
    private settingWidthToChild: boolean = false;
    private selectedData: any = [];
    private changeOnDblClick: boolean = true;
    @autowired(ElmerDOM)
    private domObj: ElmerDOM;
    constructor(props:any) {
        super(props);
        this.data = props.data || [];
    }
    handleOnUpdateChildren(data: any): void {
        this.data = data;
    }
    handleOnItemClick(evt: IElmerEvent): void {
        const dom = this.dom[this.id];
        const domList = this.domObj.find(dom,"li label");
        this.domObj.removeClass(domList, "active");
        this.domObj.addClass(evt.target, "active");
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        !this.changeOnDblClick && this.selectedDataChange(evt, evt.data);
    }
    handleOnItemDblClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.changeOnDblClick && this.selectedDataChange(evt, evt.data);
    }
    $after(): void {
        const parent:HTMLElement = this.dom[this.id];
        if(parent && this.containerWidth<=0 && !this.settingWidthToChild) {
            this.setData({
                containerWidth: parent.offsetWidth
            });
        }
    }
    $onPropsChanged(newProps: any): void {
        this.setData({
            data: newProps.data
        }, true);
    }
    private selectedDataChange(evt:IElmerEvent, data:any): void {
        if(this.props.isMutil) {
            const valueKey = this.props.valueKey || "key";
            let isExists = false;
            let index = -1;
            for(let i=0;i<this.selectedData.length;i++) {
                if(this.selectedData[i][valueKey] === data[valueKey]) {
                    isExists = true;
                    index = i;
                    break;
                }
            }
            if(!isExists) {
                const tmpData = JSON.parse(JSON.stringify(this.selectedData)) || [];
                tmpData.push(data);
                this.setData({
                    selectedData: tmpData
                });
            } else {
                const tmpData = JSON.parse(JSON.stringify(this.selectedData)) || [];
                tmpData.splice(index,1);
                this.setData({
                    selectedData: tmpData
                });
            }
        } else {
            this.setData({
                selectedData: [data]
            });
        }
        typeof this.props.onChange === "function" && this.props.onChange(evt, this.selectedData);
    }
}
