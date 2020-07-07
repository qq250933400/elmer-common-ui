import { defineGlobalConfiguration } from "elmer-ui-core/lib/configuration";

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
                                path: "/desktop",
                                reduxActionType: "ACTION_UPDATE_TO_REDUX"
                            }
                        },
                        userList: {
                            url: "/admin/users/list",
                            type: "POST",
                            options: {
                                path: "/desktop",
                                reduxActionType: "ACTION_UPDATE_TO_REDUX"
                            }
                        },
                        groupList: {
                            url: "/admin/users/group",
                            type: "POST",
                            options: {
                                path: "/desktop",
                                reduxActionType: "REDUX_ACTION_UPDATE_USERS_GROUP"
                            }
                        },
                        adminUserList: {
                            url: "/admin/adminUser/list",
                            type: "POST",
                            options: {
                                path: "/desktop",
                                reduxActionType: "REDUX_ACTION_UPDATE_ADMIN_USERS_LIST"
                            }
                        },
                        adminRightModule: {
                            url: "/admin/users/group/rights/module",
                            type: "POST",
                            options: {
                                path: "/desktop",
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
                    }
                }
            }
        }
    }
});
