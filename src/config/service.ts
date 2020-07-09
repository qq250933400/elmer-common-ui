import { defineGlobalConfiguration } from "elmer-ui-core/lib/configuration";

const userSettingPath = "/admin/usersetting";

defineGlobalConfiguration({
    router: {
        service: {
            config: {
                admin: {
                    baseUrl: "http://localhost/api/public/index.php",
                    endPoints: {
                        userGroups: {
                            url: "/admin/users/group",
                            type: "POST",
                            options: {
                                path: userSettingPath,
                                reduxActionType: "ACTION_UPDATE_TO_REDUX"
                            }
                        },
                        userList: {
                            url: "/admin/users/list",
                            type: "POST",
                            options: {
                                path: userSettingPath,
                                reduxActionType: "ACTION_UPDATE_TO_REDUX"
                            }
                        },
                        groupList: {
                            url: "/admin/users/group",
                            type: "POST",
                            options: {
                                path: userSettingPath,
                                reduxActionType: "REDUX_ACTION_UPDATE_USERS_GROUP"
                            }
                        },
                        adminUserList: {
                            url: "/admin/adminUser/list",
                            type: "POST",
                            options: {
                                path: userSettingPath,
                                reduxActionType: "REDUX_ACTION_UPDATE_ADMIN_USERS_LIST"
                            }
                        },
                        adminRightModule: {
                            url: "/admin/users/group/rights/module",
                            type: "POST",
                            options: {
                                path: userSettingPath,
                                reduxActionType: "REDUX_ACTION_UPDATE_ADMIN_RIGHT_MODULE"
                            }
                        }
                    }
                }
            }
        }
    },
    service: {
        config: {
            admin: {
                baseUrl: "http://localhost/api/public/index.php",
                endPoints: {
                    updateWebsiteSetting: {
                        url: "/admin/setting/submitWebsite",
                        type: "POST"
                    },
                    editGroupInfo: {
                        url: "/admin/users/group/add",
                        type: "POST"
                    }
                }
            }
        }
    }
});
