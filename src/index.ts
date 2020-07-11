import { ElmerUI, WindowResizeListen } from "elmer-ui-core";

import "./app";
import "./components";
import "./components/dialog/WinForm";
import "./config/service";
import "./desktop";
import { loginReducer, testReducer } from "./state/loginReducer";
import "./style/app.less";
import "./style/icon/less/font-awesome.less";
// // dd
// tslint:disable-next-line: ordered-imports
import { createKeyboardNumber } from "./components/mobile/numberKeyboard";

// window.onload = ()=> {
//     const ui = new ElmerUI();
//     const indexData = {
//     };
//     let wResizeListen = new WindowResizeListen();
//     let htmlCode = require("./app/views/router.html");
//     wResizeListen.listen();
//     // tslint:disable-next-line:no-console
//     console.time("ElmerRender");
//     ui.render(
//         document.getElementById("app"),
//         htmlCode, // "<eui-index />",
//         indexData);
//     htmlCode = null;
//     wResizeListen = null;
//     // tslint:disable-next-line:no-console
//     console.timeEnd("ElmerRender");
// };
