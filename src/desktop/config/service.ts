import {
    appServiceConfig,
    defineGlobalConfiguration
} from "elmer-ui-core";
import { IServiceConfig, IServiceEndPoint } from "elmer-ui-core/lib/interface/IElmerService";
// setServiceConfig({});

appServiceConfig.defineServiceNamespace("admin", <IServiceConfig<any, any>> {
    baseUrl: "http://127.0.0.1/api/public/index.php/",
    endPoints: {
        aa: {
            url: "sss",
            type: "POST",
            payload: {
                title: "aaaa"
            }
        },
        updateWebsiteSetting: {
            url: "/admin/setting/submitWebsite",
            type: "POST"
        }
    }
});
appServiceConfig.setServiceRequstConfig("admin", "login", {
    url: "admin/login",
    type: "POST"
});

export default {};
