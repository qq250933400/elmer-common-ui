import { defineGlobalState, getGlobalState, redux } from "elmer-ui-core";
import { REDUX_ACTION_LOGIN_CONFIG } from "./actions";

const initState = {
    loginConfig: {}
};

export const loginReducer = (state:any = initState, action:any) => {
    switch(action.type) {
        // handle the login page api response
        case REDUX_ACTION_LOGIN_CONFIG: {
            return {
                ...initState,
                ...state,
                loginConfig: action.data || {}
            };
        }
    }
    return state;
};

export const testReducer = () => {
    return {
        title: "demo",
        purpers: "for dev"
    };
};

redux.createReducer(getGlobalState, defineGlobalState, "home.news", (state: any, action) => {
    let updateState:any;
    switch(action.type) {
        case "REDUX_ACTION_LOGIN_CONFIG_HOME": {
            updateState = action.data;
            break;
        }
    }
    return {
        title: "defineByCreate",
        ...(updateState || {})
    };
});
