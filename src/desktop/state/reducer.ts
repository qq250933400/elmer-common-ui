import { autoInit, redux } from "elmer-ui-core";
import { demoAppData } from "../DesktopApp";
const initState = {
    deskTopApp: demoAppData
};

redux.defineReducer(autoInit(redux.ReduxController), "desktop", (state = initState, action):any => {
    console.log("----Init---", action, this);
    return state;
});
