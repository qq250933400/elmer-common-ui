import { REDUX_ACTION_UPDATE_ADMIN_USERS_LIST, REDUX_ACTION_UPDATE_USERS_GROUP } from "./settingReducer";

export const actionUpdateUserGroup = (data) => ({
    type: REDUX_ACTION_UPDATE_USERS_GROUP,
    data
});

export const actionUpdateUserList = (data) => ({
    type: REDUX_ACTION_UPDATE_ADMIN_USERS_LIST,
    data
});
