import { Component, declareComponent, IPropCheckRule, PropTypes } from "elmer-ui-core";

type TypeLoginAppProps = {
    copyRight: IPropCheckRule;
    userNamePH: IPropCheckRule;
    userName:IPropCheckRule;
    passwordPH: IPropCheckRule;
    loginText: IPropCheckRule;
    loginApiEndPoint: IPropCheckRule;
    loginApiNamespace: IPropCheckRule;
    registeText: IPropCheckRule;
    registeURL: IPropCheckRule;
    forgetText: IPropCheckRule;
    forgetURL: IPropCheckRule;
    onRegisteClick: IPropCheckRule;
    onForgetClick: IPropCheckRule;
    onBeforeLogin: IPropCheckRule;
    onAfterLogin: IPropCheckRule;
};

@declareComponent({
    selector: "AppLogin",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export class LoginPageComponent extends Component {
    static propType: TypeLoginAppProps = {
        copyRight: {
            defaultValue: "©2010-2019 All right by elmer",
            description: "copy right information",
            rule: PropTypes.string.isRequired
        },
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
    loginProps: any = {};
    constructor(props:any) {
        super(props);
        for(const key in props) {
            if(["children", "copyRight"].indexOf(key) < 0) {
                this.loginProps[key] = props[key];
            }
        }
    }
}
