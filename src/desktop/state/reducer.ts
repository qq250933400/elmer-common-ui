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
    userWallperPlugin: "images"
};

redux.defineReducer(autoInit(redux.ReduxController), "desktop", (state = initState, action):any => {
    return state;
});

export default {};
