import { Common } from "elmer-common";
import { autowired, ElmerDOM } from "elmer-ui-core";
import CodeEditorPlugin from "./CodeEditorPlugin";
import { CODE_EDITOR_PLUGIN_CONFIG_KEY, TypeCodeEditorLineData } from "./TypeCodeEditor";

export default class CodeEditorModel extends Common {
    lineData: any[] = [];
    dom: any;
    editorContainer: HTMLDivElement;
    complile: CodeEditorPlugin;
    highLight: any;
    isEdit: boolean;
    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(dom:any) {
        super();
        const config = window[CODE_EDITOR_PLUGIN_CONFIG_KEY] || {};
        if(config[dom.props.language]) {
            const ComplilePlugin = config[dom.props.language].plugin;
            this.highLight = config[dom.props.language].highLight;
            if(typeof ComplilePlugin === "function") {
                this.complile = new ComplilePlugin();
            }
        }
        this.dom = dom;
        this.isEdit = dom.props.isEdit;
    }
    setEditorContainer(div:HTMLDivElement): void {
        this.editorContainer = div;
    }
    convertTextToLineData(txt: string): TypeCodeEditorLineData[] {
        const resultData: TypeCodeEditorLineData[] = [];
        const lineData: any[] = [];
        const lineArr = (txt||"").split(/[\r\n]/);
        const lineHeight = this.dom.props.lineHeight;
        lineArr.map((lineStr: string) => {
            resultData.push({
                index: resultData.length + 1,
                source: lineStr
            });
            lineData.push({
                key: lineData.length,
                index: resultData.length,
                style: `min-height: ${lineHeight}px;height: ${lineHeight}px;line-height: ${lineHeight}px;`,
                className: ""
            });
        });
        this.lineData = lineData;
        this.analyzeCode(txt);
        return resultData;
    }
    analyzeCode(txt: string): void {

    }
    getLinesData():any[] {
        const lineData: any[] = [];
        const lineHeight = this.dom.props.lineHeight;
        const style = `min-height: ${lineHeight}px;line-height: ${lineHeight}px;`;
        for(let i=0,mLen = this.editorContainer.children.length; i<mLen; i++) {
            const lineDomHeight = this.editorContainer.children[i].clientHeight;
            lineData.push({
                key: i,
                index: i + 1,
                style: style + "height:" + lineDomHeight + "px;",
                className: ""
            });
        }
        return lineData;
    }
    addNewLine(currentLineDom:HTMLDivElement): void {
        const lineHeight = this.dom.props.lineHeight;
        const lineDom = document.createElement("div");
        const currentIndex = currentLineDom.getAttribute("data-index");
        const index = (parseInt(currentIndex, 10) + 1);
        const nextLine = currentLineDom.nextSibling;
        lineDom.className = "view-line";
        lineDom.setAttribute("style", `line-height:${lineHeight}px;min-height: ${lineHeight}px;`);
        lineDom.setAttribute("type", "line");
        lineDom.setAttribute("data-index", index.toString());
        lineDom.innerHTML = "<span></span>";
        lineDom.setAttribute("contentEditable", "true");
        this.$.removeClass(currentLineDom, "active");
        if(nextLine) {
            this.editorContainer.insertBefore(lineDom, nextLine);
            for(let i = index; i<this.editorContainer.children.length; i++) {
                const line = this.editorContainer.children[i];
                line.setAttribute("data-index", i.toString());
            }
        } else {
            this.editorContainer.appendChild(lineDom);
        }
        lineDom.focus();
    }
    attachTextDataToDom(data: TypeCodeEditorLineData[]): void {
        if(data) {
            const lineHeight = this.dom.props.lineHeight;
            let isCommentFlag = false;
            data.map((lineData, index:any): void => {
                const lineDom = document.createElement("div");
                lineDom.className = "view-line";
                lineDom.setAttribute("style", `line-height:${lineHeight}px;min-height: ${lineHeight}px;`);
                lineDom.setAttribute("type", "line");
                lineDom.setAttribute("data-index", index);
                if(this.isEdit) {
                    lineDom.setAttribute("contentEditable", "true");
                }
                this.analyzeText(lineDom, lineData.source, isCommentFlag);
                this.editorContainer.appendChild(lineDom);
            });
            isCommentFlag = null;
        }
    }
    private analyzeText(viewLine: HTMLDivElement,str: string, commentFlag: boolean): void {
        const spaceMatch = str.match(/^([\s]{1,})/);
        const lineHeight = this.dom.props.lineHeight;
        const spanStyle = `line-height:${lineHeight}px;min-height: ${lineHeight}px;`;
        if(spaceMatch) {
            const sLen = spaceMatch[1].length;
            const spanNone = document.createElement("span");
            spanNone.className = "view-space";
            spanNone.innerHTML = "&nbsp;".repeat(sLen);
            spanNone.setAttribute("style", spanStyle);
            viewLine.appendChild(spanNone);
        }
        this.analyzeTextKeywords(viewLine, str.replace(/^\s*/,""), spanStyle);
    }
    /**
     * 解析单行代码
     * @param viewLine 当前行编辑dom
     * @param str 当前行代码
     * @param style 当前行默认样式
     * @param isString 是否字符未结束
     * @param isComment 是否注释未结束
     */
    private analyzeTextKeywords(viewLine:HTMLDivElement,str: string, style?: string, isString?: boolean, isComment?: boolean): void {
        if(!isString && !isComment) {
            if(/^\/\//.test(str)) {
                const sp = document.createElement("span");
                sp.textContent = str;
                sp.className = "view-comment";
                viewLine.appendChild(sp);
            } else if(/^\"/.test(str) || /\'/.test(str) || /^\`/.test(str)) {
                console.log("string line");
            } else {
                if(str.indexOf("\"")>0 || str.indexOf("'")>0) {
                    // 包含字符串变量
                } else if(/\/\/[\s\S]{1,}$/.test(str)) {
                    const cMatch = str.match(/\/\/[\s\S]{1,}$/);
                    const commentValue = cMatch[0];
                    const notComment = str.substr(0, cMatch.index);
                    this.analyzeTextKeywords(viewLine, notComment, style, false, false);
                    // 在最后追加comment元素
                    const configClass:string = this.getValue(this.highLight, "comment.className");
                    const commentDom = this.createLineItemElement(commentValue, (!this.isEmpty(configClass) ? configClass : "view-comment"));
                    viewLine.appendChild(commentDom);
                } else {
                    const varArr = str.split(";"); // 分号区分结束
                    if(varArr.length > 1) {
                        varArr.forEach((codeSplit: string, index: number) => {
                            if(!this.isEmpty(codeSplit)) {
                                if(/^\s{1,}$/.test(codeSplit)) {
                                    viewLine.appendChild(this.createSpaceElement(codeSplit.length)); // 有空格内容
                                } else {
                                    this.analyzeTextKeywords(viewLine, codeSplit, style);
                                    viewLine.appendChild(this.createLineItemElement(";", "view-split"));
                                }
                            }
                        });
                    } else {
                        const keyReg = /^(\S{1,})(\s|$)/;
                        let lStr = str;
                        let keyMatch = str.match(keyReg);
                        while(keyMatch) {
                            const keyValue = keyMatch[1];
                            const keyClassName = this.findKeywordClassName(keyValue);
                            const keySpan = document.createElement("span");
                            keySpan.textContent = keyValue;
                            keySpan.setAttribute("style", style);
                            if(!this.isEmpty(keyClassName)) {
                                keySpan.className = keyClassName;
                            }
                            viewLine.appendChild(keySpan);
                            // ----- 前面的空格提出来
                            lStr = lStr.replace(/^(\S{1,})/, "");
                            const spMatch = lStr.match(/^\s{1,}/);
                            if(spMatch) {
                                viewLine.appendChild(this.createSpaceElement(spMatch[0].length));
                            }
                            lStr = lStr.replace(keyReg, ""); // 清除空格继续下一个关键词的检测
                            lStr = lStr.replace(/^\s{1,}/, "");
                            keyMatch = lStr.match(keyReg);
                        }
                    }
                }
            }
        }
    }
    private createLineItemElement(txt: string, className: string): HTMLSpanElement {
        const span = document.createElement("span");
        const lineHeight = this.dom.props.lineHeight;
        const spanStyle = `line-height:${lineHeight}px;min-height: ${lineHeight}px;`;
        span.textContent = txt;
        span.className = className;
        span.setAttribute("style", spanStyle);
        return span;
    }
    private createSpaceElement(len: number): HTMLSpanElement {
        const span = document.createElement("span");
        const lineHeight = this.dom.props.lineHeight;
        const spanStyle = `line-height:${lineHeight}px;min-height: ${lineHeight}px;`;
        span.innerHTML = "&nbsp;".repeat(len);
        span.setAttribute("style", spanStyle);
        return span;
    }
    private findKeywordClassName(keyword: string):  any {
        let resultClassName = "";
        if(this.highLight) {
            Object.keys(this.highLight).map((gKey: string): void => {
                const keyConfig = this.highLight[gKey];
                if(keyConfig && this.isArray(keyConfig.rules)) {
                    for(const cKey of keyConfig.rules) {
                        if(this.isRegExp(cKey)) {
                            if(cKey.test(keyword)) {
                                resultClassName = keyConfig.className; break;
                            }
                        } else {
                            if(cKey === keyword) {
                                resultClassName = keyConfig.className; break;
                            }
                        }
                    }
                }
            });
        }
        return resultClassName;
    }
}
