import {
    autowired,
    Component,
    declareComponent,
    ElmerServiceRequest,
    IElmerEvent,
    IPropCheckRule,
    PropTypes
} from "elmer-ui-core";
import { showToast } from "../../../components/toast";
import "./index.less";

type TypeLoginProps = {
    userNamePH: IPropCheckRule;
    userName:IPropCheckRule;
    passwordPH: IPropCheckRule;
    loginText: IPropCheckRule;
    loginApiEndPoint: IPropCheckRule;
    loginApiNamespace:IPropCheckRule;
    registeText: IPropCheckRule;
    registeURL: IPropCheckRule;
    forgetText: IPropCheckRule;
    forgetURL: IPropCheckRule;
    onRegisteClick: IPropCheckRule;
    onForgetClick: IPropCheckRule;
    onBeforeLogin: IPropCheckRule;
    onAfterLogin: IPropCheckRule;
};

type TypeLoginStateKeys = Exclude<keyof TypeLoginProps, "onRegisteClick" | "onForgetClick">;
type TypeLoginState = {[P in TypeLoginStateKeys]?: any;} & {
    password?: string;
    isLoading?: boolean;
    formTheme?: string;
    isDoLogin?: boolean;
};

@declareComponent({
    selector: "login",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export class LoginComponent extends Component {
    static propType: TypeLoginProps = {
        userNamePH: {
            defaultValue: "邮箱或手机号码",
            description: "UserName Placeholder",
            rule: PropTypes.string.isRequired
        },
        userName: {
            defaultValue: "",
            description: "默认登录用户名",
            rule: PropTypes.string.isRequired
        },
        passwordPH: {
            defaultValue: "登录密码",
            description: "password Placeholder",
            rule: PropTypes.string.isRequired
        },
        loginText: {
            defaultValue: "登录",
            description: "Login button title",
            rule: PropTypes.string.isRequired
        },
        loginApiEndPoint: {
            description: "the link for send login request",
            rule: PropTypes.string.isRequired
        },
        loginApiNamespace: {
            description: "set namespace for the api endPoint config",
            rule: PropTypes.string
        },
        registeText: {
            defaultValue: "注册账户",
            description: "registe link title",
            rule: PropTypes.string.isRequired
        },
        registeURL: {
            defaultValue: "javascript:void(0);",
            description: "registe link url",
            rule: PropTypes.string.isRequired
        },
        forgetText: {
            defaultValue: "忘记密码？",
            description: "forget link title",
            rule: PropTypes.string.isRequired
        },
        forgetURL: {
            defaultValue: "javascript:void(0);",
            description: "forget link url",
            rule: PropTypes.string.isRequired
        },
        onRegisteClick: {
            description: "Handle on registe link click event",
            rule: PropTypes.func
        },
        onForgetClick: {
            description: "Handle on forget link click event",
            rule: PropTypes.func
        },
        onBeforeLogin: {
            description: "before login event",
            rule: PropTypes.func
        },
        onAfterLogin: {
            description: "after login action when login success",
            rule: PropTypes.func
        }
    };
    state: TypeLoginState = {
        userName: "",
        password: "",
        isDoLogin: false
    };
    props:{[P in keyof TypeLoginProps]: any};
    logoId: string = this.getRandomID();
    isDoLogin: boolean = false;
    @autowired(ElmerServiceRequest)
    private ajax:ElmerServiceRequest;
    constructor(props: any) {
        super(props);
        for(const key in props) {
            if(["onRegisteClick", "onForgetClick", "children"].indexOf(key)<0) {
                this.state[key] = props[key];
            }
        }
    }
    onLoginClick(): void {
       this.setState({
           formTheme: "eui-login-loading-layout",
           isDoLogin: true
       });
    }
    onRegisteClick(evt:IElmerEvent): void {
        typeof this.props.onRegisteClick === "function" && this.props.onRegisteClick(evt);
    }
    onForgetClick(evt:IElmerEvent): void {
        typeof this.props.onForgetClick === "function" && this.props.onForgetClick(evt);
    }
    $after(): void {
        // if(this.dom[this.logoId]) {
        //     this.transitionEnd(this.dom[this.logoId], this.onLogoTransitionEnd);
        // }
        // console.log(this.dom[this.logoId]);
    }
    private onLogoTransitionEnd(): void {
        if(this.state.isDoLogin) {
            this.state.isDoLogin = false;
            this.doLogin();
        }
    }
    private doLogin(): void {
        const sendData = {
            userName: this.state.userName,
            password: this.state.password
        };
        const beforeEvent = {
            data: sendData,
            cancel: false
        };
        typeof this.props.onBeforeLogin === "function" && this.props.onBeforeLogin(beforeEvent);
        try {
            if(beforeEvent.cancel) {
                return;
            } else {
                if(this.isEmpty(sendData.userName)) {
                    throw new Error("请输入登录帐号");
                }
            }
            this.setState({
                formTheme: "eui-login-loading-layout eui-login-loading-form",
                isLoading: true
            });
            // tslint:disable-next-line: no-floating-promises
            this.ajax.sendRequest({
                endPoint: this.state.loginApiEndPoint,
                namespace: this.state.loginApiNamespace,
                type: "POST",
                data: sendData,
                success: (resp:any) => {
                    if(typeof this.props.onAfterLogin === "function") {
                        const result = this.props.onAfterLogin(resp);
                        if(result && typeof result.then === "function") {
                            result.then(()=> {
                                this.setState({
                                    isLoading: false,
                                    formTheme: ""
                                });
                            }).catch(() => {
                                this.setState({
                                    isLoading: false,
                                    formTheme: ""
                                });
                            });
                        } else {
                            this.setState({
                                isLoading: false,
                                formTheme: ""
                            });
                        }
                    } else {
                        if(resp.statusCode === 200 || resp.success) {
                            showToast("登录成功", {
                                icon: "Success"
                            });
                        } else {
                            showToast(resp.message || resp.info || "未知错误信息", {
                                icon: "Error"
                            });
                        }
                        this.setState({
                            isLoading: false,
                            formTheme: ""
                        });
                    }
                },fail:(err) => {
                    showToast(err.message || err.info || err.statusText || "未知错误信息", {
                        icon: "Error"
                    });
                    this.setState({
                        isLoading: false,
                        formTheme: ""
                    });
                }
            });
        } catch(e) {
            showToast(e.message);
            this.setState({
                isLoading: false,
                formTheme: ""
            });
        }
    }
}
