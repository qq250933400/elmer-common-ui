import { Common } from "elmer-common";

export default abstract class CodeEditorPlugin extends Common {
    abstract analyzeLineText(str: string): void;
}
