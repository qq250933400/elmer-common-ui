import {
    CODE_COMMENT_MODE_AREA,
    CODE_COMMENT_MODE_LINE
} from "../TypeCodeEditor";

export default {
    name: "javascript",
    comment: {
        lineMode: /\/\/[\s\S]{1,}$/,
        mutilMode: {
            start: "\/\*+",
            end: "\*\/"
        },
        className: "view-comment"
    },
    keywords: {
        rules: ["import", "from", "function", "if", "else", "switch", "case", "while", "do", "Math", "for", "in", "of", "typeof", "forEach", "map"],
        className: "view-keyword"
    },
    vars: {
        rules: ["const", "var", "let","class", "extends", "constructor"],
        className: "view-var"
    },
    class: {
        rules: ["class", "abstract", "interface"],
        className: "view-class"
    },
    string: {
        className: "view-string"
    },
    splitChars: {
        rules: ["{", "}", "[", "]", "+", "-", "*", "/"],
        className: "view-split"
    }
};
