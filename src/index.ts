import { ElmerUI, WindowResizeListen } from "elmer-ui-core";

import "./app";
import "./components";
import "./components/dialog/WinForm";
// import "./config";
import "./desktop";
import { loginReducer, testReducer } from "./state/loginReducer";
import "./style/app.less";
import "./style/icon/less/font-awesome.less";
import { eAlert } from "./components";
// // dd

// window.onload = ()=> {
//     const ui = new ElmerUI();
//     const indexData = {
//         reducers: {
//             // login: loginReducer,
//             // nextnode: {
//             //     demo: testReducer
//             // }
//         }
//     };
//     typeof window["debug"] === "function" && window["debug"](false);
//     let wResizeListen = new WindowResizeListen();
//     let htmlCode = require("./app/views/layout.html");
//     wResizeListen.listen();
//     // tslint:disable-next-line:no-console
//     console.time("ElmerRender");
//     ui.render(document.getElementById("app"), htmlCode, indexData);
//     htmlCode = null;
//     wResizeListen = null;
//     // tslint:disable-next-line:no-console
//     console.timeEnd("ElmerRender");
// };
