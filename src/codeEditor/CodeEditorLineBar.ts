import { Component, IElmerEvent, IElmerMouseEvent, PropTypes } from "elmer-ui-core";
import { TypeCodeEditorLineProps, TypeCodeEditorLinePropsRule } from "./TypeCodeEditor";

export default class CodeEditorLineBar extends Component {
    static propType: TypeCodeEditorLinePropsRule = {
        data: {
            defaultValue: [],
            rule: PropTypes.array.isRequired
        },
        onLineClick: {
            rule: PropTypes.func
        }
    };
    props: TypeCodeEditorLineProps;
    state: any = {
        data: [],
        lineSpanStyle: "line-height: 24px;"
    };
    choseIndex: number;
    constructor(props:TypeCodeEditorLineProps) {
        super(props);
        this.state.data = props.data;
        if(props.lineHeight > 0) {
            this.state.lineSpanStyle = `line-height: ${props.lineHeight}px;`;
        }
    }
    onLineClick(evt:IElmerEvent):void {
        const index = (<HTMLElement>evt.nativeEvent.target).getAttribute("data-index");
        if(this.isNumeric(index) && !this.isEmpty(index)) {
            const updateIndex = parseInt(index, 10);
            const newData = JSON.parse(JSON.stringify(this.state.data));
            let isActive = false;
            if(newData[updateIndex]) {
                if(updateIndex !== this.choseIndex) {
                    newData[updateIndex].className = "active";
                    if(newData[this.choseIndex]) {
                        newData[this.choseIndex].className = "";
                    }
                    isActive = true;
                } else {
                    if(!this.isEmpty(newData[updateIndex].className)) {
                        newData[updateIndex].className = "";
                        isActive = false;
                    } else {
                        newData[updateIndex].className = "active";
                        isActive = true;
                    }
                }
            }
            this.choseIndex = updateIndex;
            this.setState({
                data: newData
            });
            typeof this.props.onLineClick === "function" && this.props.onLineClick(updateIndex, isActive);
        }
    }
    onSelectStart(evt:IElmerMouseEvent): boolean {
        evt.nativeEvent.returnValue = false;
        return false;
    }
    render():any {
        return require("./views/lines.html");
    }
}
