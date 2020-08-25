import { Component, declareComponent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { IVirtualElement } from "elmer-virtual-dom";

@declareComponent({
    selector: "layout-row"
})
export class LayoutRow extends Component {
    static propTypes: any = {
        theme: <IPropCheckRule> {
            defaultValue: "",
            description: "类名",
            rule: propTypes.string.isRequired
        },
        height:<IPropCheckRule> {
            defaultValue: "",
            description: "高度",
            rule: propTypes.string.isRequired
        },
        style: <IPropCheckRule> {
            defaultValue: "",
            description: "内联样式",
            rule: propTypes.string.isRequired
        }
    };
    state:any = {
        theme: "",
        setHeight: ""
    };
    props:any;
    constructor(props: any) {
        super(props);
        this.state.theme = !this.isEmpty(props.theme) ? props.theme : "";
        this.state.setHeight = props.setHeight || "";
    }
    $before(): void {
        this.updateChildrenSetSize();
    }
    render(): string {
        let cHeight = this.state.setHeight || "";
        const innerStyle = this.props.style || "";
        cHeight = !/\;/.test(cHeight) && cHeight.length > 0 ? cHeight + ";" + innerStyle : cHeight + innerStyle;
        return `<div class="{{state.theme}} eui-layout-row" style="${cHeight}"><context /></div>`;
    }
    $onPropsChanged(props:any): void {
        this.setState({}, true);
    }
    private updateChildrenSetSize(): void {
        try {
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
        } catch(e) {
            // tslint:disable-next-line:no-console
            console.error(e);
        }
    }
}
