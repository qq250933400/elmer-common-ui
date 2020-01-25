import { appServiceConfig, defineGlobalConfiguration } from "elmer-ui-core";
import { IServiceConfig } from "elmer-ui-core/lib/interface/IElmerService";

type RouterApiOptions = {
    path?: string | RegExp;
    reduxActionType?: string;
};
type BlogApi = {
    Blog: {
        login: IServiceConfig<any, RouterApiOptions>;
        homeWrapper: IServiceConfig<any, RouterApiOptions>;
    }
};

type RouterApiData = {
    list?: IServiceConfig<any, RouterApiOptions>;
    AppBlog: IServiceConfig<any, RouterApiOptions>;
};

defineGlobalConfiguration<BlogApi,RouterApiOptions,RouterApiData, RouterApiOptions, any, any, any>({
    router: {
        service: {
            common: {
                onBefore:(evt:any) => {
                    console.log(evt);
                    return true;
                }
            },
            config: {
                AppBlog: {
                    baseUrl: "http://localhost:3000/assets",
                    dummy: true,
                    dummyPath: "http://localhost:3000/assets/dummy/",
                    endPoints: {
                        swaperList: {
                            url: "swapper/home",
                            type: "GET",
                            dummy: "swapperHome.json",
                            uri: {
                                pageSize: 10,
                                token: "c1aaa7ce-8921-d8bd-4b63-0adaf1c1"
                            },
                            options: {
                                path: "/",
                                reduxActionType: "REDUX_ACTION_LOGIN_CONFIG_HOME"
                            },
                            payload: {
                                token: "aaaxxx--xxd-ff-fss",
                                userId: "string--number"
                            }
                        },
                        list: {
                            url: "bb",
                            type: "GET",
                            dummy: "swapperHome.json",
                            options: {
                                path: "/",
                                reduxActionType: "REDUX_ACTION_LOGIN_BB"
                            }
                        },
                        loginBack: {
                            url: "login/back",
                            type: "GET",
                            dummy: "loginConfig.json",
                            options: {
                                path: "/login",
                                reduxActionType: "REDUX_ACTION_LOGIN_CONFIG"
                            }
                        }
                    }
                }
            }
        }
    },
    service: {
        common: {
            onError: (err) => {
                console.log(err);
                return true;
            }
        },
        config: {
            Blog: {
                baseUrl: "http://localhost/",
                dummy: false,
                endPoints: {
                    login: {
                        url: "aax",
                        options: {
                            path:"demo version"
                        }
                    }
                },
                envUrls: ""
            },
        }
    },
    i18n: {
        locale: "enGB",
        data: {
            "enGB": {
                aa: "aaaxx"
            }
        }
    }
});

appServiceConfig.setServiceRequstConfig("Blog", "homeCategory", {
    url: "admin/list",
    type: "GET",
    dummy: "sss"
});
