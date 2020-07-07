import { Component, declareComponent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { IVirtualElement } from "elmer-virtual-dom";
import "./col";
import "./index.less";
import "./row";

type LayoutPropTypes = {
    theme: IPropCheckRule;
    children?: IPropCheckRule[];
};
type LayoutProps = {
    theme: string;
    children?: IVirtualElement[];
};
@declareComponent({
    selector: "layout"
})
export class LayoutComponent extends Component {
    static propTypes: LayoutPropTypes = {
        theme: <IPropCheckRule> {
            defaultValue: "",
            description: "类名",
            rule: propTypes.string.isRequired
        }
    };
    state:any = {
        theme: "",
        timeId: ""
    };
    constructor(props: LayoutProps) {
        super(props);
        this.state.theme = !this.isEmpty(props.theme) ? props.theme : "";
    }
    render(): string {
        this.updateChildrenSetSize();
        return `<div data-time="{{state.timeId}}" class="{{state.theme}} eui-layout"><context /></div>`;
    }
    $onPropsChanged(): void {
        this.setState({
            timeId: this.getRandomID()
        }, true);
    }
    private updateChildrenSetSize(): void {
        const children:IVirtualElement[] = this.props.children || [];
        const colAllWidth:string[] = [], rowAllHeight:string[] = [];
        let colAutoWidth = false, colAutoWidthIndex = -1;
        let colAutoHeight = false, colAutoHeightIndex = -1;
        for(let i=0,cLen = children.length;i<cLen;i++) {
            const tmpNode = children[i];
            if(tmpNode.tagName === "eui-layout-col") {
                if(/^\s*\*\s*$/.test(tmpNode.props.width)) {
                    if(colAutoWidth) {
                        throw new Error("自适应宽度col只能设置一个元素");
                    }
                    colAutoWidth = true;
                    colAutoWidthIndex = i;
                } else {
                    const tmpColWidth = this.isNumeric(tmpNode.props.width) ? tmpNode.props.width + "px" : tmpNode.props.width;
                    colAllWidth.push(tmpColWidth);
                    children[i].props.setWidth = `width:${tmpColWidth};`;
                }
            } else if(tmpNode.tagName === "eui-layout-row") {
                if(/^\s*\*\s*$/.test(tmpNode.props.height)) {
                    if(colAutoHeight) {
                        throw new Error("自适应高度row只能设置一个元素");
                    }
                    colAutoHeight = true;
                    colAutoHeightIndex = i;
                } else {
                    const tmpColHeight= this.isNumeric(tmpNode.props.height) ? tmpNode.props.height + "px" : tmpNode.props.height;
                    rowAllHeight.push(tmpColHeight);
                    children[i].props.setHeight = `height: ${tmpColHeight};`;
                }
            }
        }
        if(colAutoWidth && colAutoWidthIndex>=0 && colAutoWidthIndex<children.length) {
            const calcWidth = "calc(100% - " + colAllWidth.join(" - ") + ")";
            children[colAutoWidthIndex].props.setWidth = `width:${calcWidth};width:-webkit-${calcWidth};width:-moz-${calcWidth};width:-ms-${calcWidth};`;
        }
        if(colAutoHeight && colAutoHeightIndex>=0 && colAutoHeightIndex<children.length) {
            const calcHeight = "calc(100% - " + rowAllHeight.join(" - ") + ")";
            children[colAutoHeightIndex].props.setHeight = `height:${calcHeight};height:-webkit-${calcHeight};height:-moz-${calcHeight};height:-ms-${calcHeight};`;
        }
    }
}
