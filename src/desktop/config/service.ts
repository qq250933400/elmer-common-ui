import {
    appServiceConfig,
    defineGlobalConfiguration
} from "elmer-ui-core";
import { IServiceConfig, IServiceEndPoint } from "elmer-ui-core/lib/interface/IElmerService";
// setServiceConfig({});

appServiceConfig.defineServiceNamespace("admin", <IServiceConfig<any, any>> {
    baseUrl: "http://127.0.0.1/api/public/index.php/",
    envUrls: {
        Prod: "../../index.php"
    },
    endPoints: {
        updateWebsiteSetting: {
            url: "/admin/setting/submitWebsite",
            type: "POST"
        },
        editGroupInfo: {
            url: "/admin/users/group/add",
            type: "POST"
        },
        deleteUserGroup: {
            url: "/admin/users/group/del",
            type: "POST"
        },
        groupList: {
            url: "/admin/users/group",
            type: "POST"
        },
        delGroupRight: {
            url: "/admin/users/group/delRights",
            type: "POST"
        },
        addGroupRight: {
            url: "/admin/users/group/addRights",
            type: "POST"
        },
        getGroupModule: {
            url: "/admin/users/group/rights/module",
            type: "POST"
        },
        getGroupRight: {
            url: "/admin/users/group/rights",
            type: "POST"
        },
        getUserGroupByUser: {
            url: "/admin/users/group/byUser",
            type: "POST"
        },
        addUserToGroup: {
            url: "/admin/users/group/addUsers",
            type: "POST"
        },
        delUserFromGroup: {
            url: "/admin/users/group/delUsers",
            type: "POST"
        },
        deleteUser: {
            url: "/admin/users/delete",
            type: "POST"
        },
        adminUserList: {
            url: "/admin/adminUser/list",
            type: "POST"
        },
        editAdminUser: {
            url: "/activity/admin/manager/submit",
            type: "POST"
        }
    }
});
appServiceConfig.setServiceRequstConfig("admin", "login", {
    url: "admin/login",
    type: "POST"
});

export default {};
