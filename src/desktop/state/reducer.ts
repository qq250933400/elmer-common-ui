import { autoInit, redux } from "elmer-ui-core";
import { demoAppData, mainMenuList,SystemQuickStartTool } from "../DesktopApp";

const initState = {
    deskTopApp: demoAppData,
    mainMenuList,
    quickStartMenu: [SystemQuickStartTool],
    template: "WebAdmin",
    background: {
        image: "./assets/wallper/background.jpg",
        color: ""
    },
    userWallperPlugin: "images",
    webconfig: {
        copyRight: "COPYRIGHT©2012    版权所有 北京**科技发展有限公司",
        servicePhone: "010-88312038-8015"
    }
};

redux.defineReducer(autoInit(redux.ReduxController), "desktop", (state = initState, action):any => {
    return state;
});

export default {};
