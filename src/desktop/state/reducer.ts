import { autoInit, redux } from "elmer-ui-core";
import { demoAppData } from "../DesktopApp";
const initState = {
    deskTopApp: demoAppData,
    background: {
        image: "./assets/wallper/background.jpg"
    }
};

redux.defineReducer(autoInit(redux.ReduxController), "desktop", (state = initState, action):any => {
    return state;
});
