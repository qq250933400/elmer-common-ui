import { IPropCheckRule } from "elmer-ui-core";

export const CODE_EDITOR_PLUGIN_CONFIG_KEY = "__CODE_EDITOR_PLUGIN_CONFIG_KEY__";
export const CODE_COMMENT_MODE_LINE = "LINE_COMMENT";
export const CODE_COMMENT_MODE_AREA = "MUTIL_LINE_COMMENT";

export type TypeCodeEditorProps = {
    lineHeight?: number;
    text?: string;
    isEdit?: boolean;
    language?: string;
};

export type TypeCodeEditorPropsRule = {[P in keyof TypeCodeEditorProps]?: IPropCheckRule};

export type TypeCodeEditorLineProps = {
    data: any[];
    lineHeight: number;
    onLineClick?: Function;
};

export type TypeCodeEditorLinePropsRule = {[P in keyof TypeCodeEditorLineProps]?: IPropCheckRule};

export type TypeCodeEditorLineData = {
    index?: number;
    source?: string;
    display?: string;
};
