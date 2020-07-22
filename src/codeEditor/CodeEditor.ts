import {
    autowired,
    Component,
    declareComponent,
    ElmerDOM,
    IElmerKeyboardEvent,
    PropTypes
} from "elmer-ui-core";
import CodeEditorLineBar from "./CodeEditorLineBar";
import CodeEditorModel from "./CodeEditorModel";
// tslint:disable-next-line: ordered-imports
import "./style/index.less";
import {
    TypeCodeEditorLineData,
    TypeCodeEditorProps,
    TypeCodeEditorPropsRule
} from "./TypeCodeEditor";

type TypeCodeEditorModel = {
    obj: CodeEditorModel
};

@declareComponent({
    selector: "CodeEditor",
    components: [
        {
            selector: "CodeEditorLineBar",
            component: CodeEditorLineBar
        }
    ],
    model: {
        obj: CodeEditorModel
    }
})
export default class CodeEditor extends Component {
    static propType: TypeCodeEditorPropsRule = {
        lineHeight: {
            description: "设置行高",
            defaultValue: 20,
            rule: PropTypes.number
        },
        text: {
            description: "加载内容",
            defaultValue: `// this is an line
            class Test extends BaseComponent {
                constructor() {
                    // do something
                }
            }
            function a() {
                var a=1; // define object
                console.log("abbccdd");
                if(abb>2) {
                    console.log("hahah");
                }
                aaa/*
                elmer s j
                aaa
                */
            }`,
            rule: PropTypes.string
        },
        isEdit: {
            description: "是否启用编辑功能",
            defaultValue: true,
            rule: PropTypes.bool.isRequired
        },
        language: {
            description: "设置支持语言",
            defaultValue: "javascript",
            rule: PropTypes.string
        }
    };
    state: any = {
        lineData: []
    };
    props: TypeCodeEditorProps;
    model: TypeCodeEditorModel;
    data: TypeCodeEditorLineData[] = [];
    editorId: string;
    editorDom: HTMLDivElement;
    lineId: string;
    lineBarDom: CodeEditorLineBar;
    private choseLineIndex: number;

    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props:any) {
        super(props);
        this.editorId = this.guid();
        this.lineId = this.guid();
    }
    $inject(): void {
        this.data = this.model.obj.convertTextToLineData(this.props.text);
        this.state.lineData = this.model.obj.lineData;
    }
    $didMount(): void {
        this.model.obj.setEditorContainer(this.dom[this.editorId]);
        this.model.obj.attachTextDataToDom(this.data);
        this.editorDom = this.dom[this.editorId];
        this.lineBarDom = this.dom[this.lineId];
        this.refreshLineBar();
    }
    render():any {
        return require("./views/editor.html");
    }
    onLineClick(lineIndex: number, isActive: boolean): void {
        if(this.choseLineIndex !== lineIndex && this.editorDom) {
            if(this.editorDom.children[this.choseLineIndex]) {
                this.$.removeClass(<HTMLElement>this.editorDom.children[this.choseLineIndex], "active");
            }
            if(this.editorDom.children[lineIndex]) {
                this.$.addClass(<HTMLElement>this.editorDom.children[lineIndex], "active");
            }
            this.choseLineIndex = lineIndex;
        } else if(this.choseLineIndex === lineIndex) {
            if(isActive) {
                if(this.editorDom.children[lineIndex]) {
                    this.$.addClass(<HTMLElement>this.editorDom.children[lineIndex], "active");
                }
            } else {
                if(this.editorDom.children[lineIndex]) {
                    this.$.removeClass(<HTMLElement>this.editorDom.children[lineIndex], "active");
                }
            }
        }
    }
    onKeyDown(evt:IElmerKeyboardEvent): void {
        if(evt.nativeEvent.keyCode === 13) {
            evt.nativeEvent.preventDefault();
            this.model.obj.addNewLine(<any>evt.nativeEvent.srcElement);
            this.refreshLineBar();
        } else if(evt.nativeEvent.keyCode === 8) {
            const lineDom = (<HTMLDivElement>evt.nativeEvent.srcElement);
            const sourceText = lineDom.innerText;
            const htmlText = lineDom.innerHTML;
            if(sourceText.length === 1 && htmlText === "<br>") {
                const next:HTMLDivElement = <any>lineDom.previousSibling;
                if(next) {
                    next.click();
                }
                lineDom.parentElement && lineDom.parentElement.removeChild(lineDom);
                this.refreshLineBar();
            }
        }
    }
    private refreshLineBar(): void {
        this.lineBarDom.setState({
            data: this.model.obj.getLinesData()
        });
    }
}
