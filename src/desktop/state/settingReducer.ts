import { autoInit, redux } from "elmer-ui-core";
const REDUX_ACTION_UPDATE_USERS_GROUP = "REDUX_ACTION_UPDATE_USERS_GROUP";
const REDUX_ACTION_UPDATE_ADMIN_USERS_LIST = "REDUX_ACTION_UPDATE_ADMIN_USERS_LIST";
const REDUX_ACTION_UPDATE_ADMIN_RIGHT_MODULE = "REDUX_ACTION_UPDATE_ADMIN_RIGHT_MODULE";

const initState = {
    usersGroup: [],
    adminUserList: [],
    adminMudule: []
};

redux.defineReducer(autoInit(redux.ReduxController), "usersGroup", (state = initState, action):any => {
    switch(action.type) {
        case REDUX_ACTION_UPDATE_USERS_GROUP: {
            return {
                ...state,
                usersGroup: action.data || []
            };
        }
        case REDUX_ACTION_UPDATE_ADMIN_USERS_LIST: {
            return {
                ...state,
                adminUserList: action.data || []
            };
        }
        case REDUX_ACTION_UPDATE_ADMIN_RIGHT_MODULE: {
            return {
                ...state,
                adminMudule: action.data || []
            };
        }
    }
    return state;
});

export default {};
