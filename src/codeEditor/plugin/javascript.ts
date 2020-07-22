import CodeEditorPlugin from "../CodeEditorPlugin";

export default class JavascriptPlugin extends CodeEditorPlugin {
    analyzeLineText(str: string): void {
        throw new Error("Method not implemented.");
    }
}
