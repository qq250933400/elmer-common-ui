import CodeEditorComponent from "./CodeEditor";
import javascriptPlugin from "./plugin/javascript";
import javascriptJSON from "./plugin/javascriptJSON";
import { CODE_EDITOR_PLUGIN_CONFIG_KEY } from "./TypeCodeEditor";

export const CodeEditor = CodeEditorComponent;

export const addCodeEditorPlugin = (lang: string, highLightConfig: any, plugin: Function): void => {
    const allConfig = window[CODE_EDITOR_PLUGIN_CONFIG_KEY] || {};
    allConfig[lang] = {
        highLight: highLightConfig,
        plugin
    };
    window[CODE_EDITOR_PLUGIN_CONFIG_KEY] = allConfig;
};

addCodeEditorPlugin("javascript", javascriptJSON, javascriptPlugin);
