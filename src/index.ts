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

window.onload = ()=> {
    const ui = new ElmerUI();
    const indexData = {
        kVisible: false,
        obj: null,
        saveValue: "",
        viewerVisible: true,
        imageList: [
            { title: "demo1", url: "http://attach.bbs.miui.com/forum/201105/17/113554rnu40q7nbgnn3lgq.jpg" },
            { title: "demo2", url: "http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1208/15/c0/12924355_1344999165562.jpg" },
            { title: "demo3", url: "http://img0.imgtn.bdimg.com/it/u=111878185,2440873383&fm=214&gp=0.jpg" },
            { title: "demo4", url: "http://attach.bbs.miui.com/forum/201310/19/235356fyjkkugokokczyo0.jpg" },
            { title: "demo5", url: "http://img2.imgtn.bdimg.com/it/u=3834552144,3875352660&fm=26&gp=0.jpg" }
        ],
        imageData: [],
        testDataList:[],
        onButtonVisible(): void {
            // this.dom["myKeyboard"].show();
            this.obj.show();
        },
        onRemoveClick(): void {
            this.obj.dispose();
        },
        handleOnInputClick(): void {
            this.obj.show();
        },
        $init(): void {
            const bResult = createKeyboardNumber({
                title: "",
                onChange: (value: string):void => {
                    const newValue = bResult.formatInput({
                        inputValue: value,
                        saveValue: this.saveValue
                    });
                    this.setData({
                        saveValue: newValue
                    });
                }
            });
            this.obj = bResult;
            for(let i=0;i<100;i++) {
                this.testDataList.push({
                    value: i
                });
            }
        },
        $didMount():void {
            console.log("first Init Render");
        },
        $didUpdate():void {
            console.log("did Update render");
        },
        onColorPickerConfirm(color:any): void {
            console.log(color);
        },
        onShowImageView(): void {
            this.setData({
                viewerVisible: true,
                imageData: this.imageList
            });
        },
        onImageViewClick(): void {
            this.setData({
                viewerVisible: false
            });
            console.log("visible hidden");
        }
    };
    typeof window["debug"] === "function" && window["debug"](false);
    let wResizeListen = new WindowResizeListen();
    let htmlCode = require("./app/views/router.html");
    wResizeListen.listen();
    // tslint:disable-next-line:no-console
    console.time("ElmerRender");
    ui.render(
        document.getElementById("app"),
        htmlCode, // "<eui-index />",
        indexData);
    htmlCode = null;
    wResizeListen = null;
    // tslint:disable-next-line:no-console
    console.timeEnd("ElmerRender");
};
