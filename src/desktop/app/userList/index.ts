import { autowired, Component, declareComponent, ElmerServiceRequest, IElmerEvent, IPropCheckRule, PropTypes, redux } from "elmer-ui-core";
import { eAlert, showLoading, showToast } from "../../../components";
import { createOfficeDataViewPager } from "../../../components/office/widget/dataView";
import { commonHandler } from "../../MCommon";
import { actionUpdateUserList } from "../../state/action";
import { createUserColumns, createUserGroupColumns } from "./tableConfig";


@redux.connect({
    mapStateToProps: (state:any) => ({
        ...(state.usersGroup || {})
    }),
    mapDispatchToProps: (dispatch) => ({
        actionUpdateUserList: (data) => (dispatch(actionUpdateUserList(data)))
    })
})
export default class UserList extends Component {
    state:any = {
        data: [],
        pager: createOfficeDataViewPager({
            page: 1,
            pageSize: 20,
            totalNums: 0,
            totalPage: 1
        }),
        gpager: createOfficeDataViewPager({
            page: 1,
            pageSize: 20,
            totalNums: 0,
            totalPage: 1
        }),
        groupData: [],
        choseUser: null
    };
    columns: any[][] = createUserColumns.call(this);
    groupColumns: any[][] = createUserGroupColumns.call(this);
    groupTablId: string;
    tabId: string;
    @autowired(ElmerServiceRequest)
    private http:ElmerServiceRequest;
    constructor(props:any) {
        super(props);
        this.state.data = this.getValue(props,"adminUserList.data") || [];
        this.state.pager.totalNums = this.state.data.length;
        this.groupTablId = this.guid();
        this.tabId = this.guid();
        this.state.groupData = this.getValue(props, "usersGroup.data") || [];
        this.state.gpager.totalNums = this.state.groupData.length;
    }
    async getUserGroupByUser(userId: number): Promise<any> {
        const loading = showLoading({title: "获取分组"});
        return new Promise<any>((resolve, reject) => {
            this.http.sendRequest({
                namespace: "admin",
                endPoint: "getUserGroupByUser",
                data: {
                    userId
                },
                complete: () => {
                    loading.dispose();
                }
            }).then((resp:any): void => {
                if(!commonHandler(resp)) {
                    resolve(resp.data);
                } else {
                    reject({});
                }
            }).catch((error) => {
                commonHandler(error);
                reject(error);
            });
        });
    }
    async updateUserForGroupDetail(groupId: number, userId: number, isAdd: boolean): Promise<any> {
        const loading = showLoading({title: "更新"});
        return new Promise<any>((resolve, reject) => {
            this.http.sendRequest({
                namespace: "admin",
                endPoint: isAdd ? "addUserToGroup" : "delUserFromGroup",
                data: {
                    groupId,
                    users: [userId]
                },
                complete: () => {
                    loading.dispose();
                }
            }).then((resp:any): void => {
                if(!commonHandler(resp)) {
                    resolve(resp.data);
                } else {
                    reject({});
                }
            }).catch((error) => {
                commonHandler(error, true);
                reject(error);
            });
        });
    }
    onDeleteUser(adminId: number): void {
        const loading = showLoading({title: "删除用户"});
        this.http.sendRequest({
            namespace: "admin",
            endPoint: "deleteUser",
            data: {
                adminId
            },
            complete: () => {
                loading.dispose();
            }
        }).then((resp:any): void => {
            if(!commonHandler(resp)) {
                this.loadUserList();
            }
        }).catch((error) => {
            commonHandler(error, true);
        });
    }
    loadUserList(): void {
        const loading = showLoading({title: "更新"});
        this.http.sendRequest({
            namespace: "admin",
            endPoint: "adminUserList",
            data: {
                page: 0
            },
            complete: () => {
                loading.dispose();
            }
        }).then((resp:any): void => {
            if(!commonHandler(resp)) {
                this.props.actionUpdateUserList(resp);
                this.setState({
                    data: resp.data || [],
                    listTime: (new Date()).getTime()
                });
            }
        }).catch((error) => {
            commonHandler(error, true);
        });
    }
    handleOnTabBeforeChange(): any {
        const userId:any = this.getValue(this.state, "choseUser.id");
        if(isNaN(userId) || userId <=0) {
            eAlert({
                title: "提示",
                message: "请选择管理用户账户。",
                msgType: "OKOnly",
                iconType: "Error"
            });
            return false;
        }
    }
    handleOnAddUser(userData:any): void {
        let userLogin = userData ? userData.userLogin : "";
        let userName = userData ? userData.userName : "";
        let password = null;
        let repeatPassword = null;
        const dResult = eAlert({
            content: `<div class="user-group-input-layout">
                <label class="layout-form-item">
                    <span>登录账号</span>
                    <input bind="state.userLogin" value="${userLogin}" class='eui-input' type='text' placeholder='登录账号不能为空'/>
                </label>
                <label class="layout-form-item" style="margin-top: 10px;">
                    <span>姓名</span>
                    <input bind="state.userName" value="${userName}" class='eui-input' type='text' placeholder="管理员显示昵称"/>
                </label>
                <label class="layout-form-item" style="margin-top: 10px;">
                    <span>登录密码</span>
                    <input bind="state.password" class='eui-input' type='password' placeholder="新增管理必须设置密码"/>
                </label>
                <label class="layout-form-item" style="margin-top: 10px;">
                    <span>重复密码</span>
                    <input bind="state.repeatPassword" class='eui-input' type='password' placeholder="重复登录密码"/>
                </label>
            </div>`,
            title: "新增管理员",
            msgType: "OkCancel",
            isMobile: false,
            onBefore: (res) => {
                if(res.button === "Ok") {
                    const bindUserLogin = this.getValue(dResult.component, "state.userLogin");
                    userLogin = !this.isEmpty(bindUserLogin) ? bindUserLogin : userLogin;
                    const bindUserName= this.getValue(dResult.component, "state.userName");
                    userName = !this.isEmpty(bindUserName) ? bindUserName : userLogin;
                    password = this.getValue(dResult.component, "state.password");
                    repeatPassword = this.getValue(dResult.component, "state.repeatPassword");
                    if(this.isEmpty(userLogin)) {
                        res.cancel = true;
                        eAlert({
                            title: "错误",
                            msgType: "OKOnly",
                            iconType: "Error",
                            message: "登录账号不能为空"
                        });
                    }
                    if((!userData || userData <= 0) && this.isEmpty(password)) {
                        res.cancel = true;
                        eAlert({
                            title: "错误",
                            msgType: "OKOnly",
                            iconType: "Error",
                            message: "新增管理员需要设置登录密码"
                        });
                    }
                    if(!this.isEmpty(password) && password !== repeatPassword) {
                        res.cancel = true;
                        eAlert({
                            title: "错误",
                            msgType: "OKOnly",
                            iconType: "Error",
                            message: "两次输入密码不相同"
                        });
                    }
                }
            },
            onOk: () => {
                let loading = showLoading({
                    title: "提交数据",
                    visible: true
                });
                this.http.sendRequest({
                    namespace: "admin",
                    endPoint: "editAdminUser",
                    data: {
                        userLogin,
                        userName,
                        password,
                        repeatPassword,
                        id: userData ? userData.id : null
                    },
                    complete: () => {
                        loading.dispose();
                        loading = null;
                    }
                }).then((resp) => {
                    if(!commonHandler(resp)) {
                        this.loadUserList();
                    }
                }).catch((err) => {
                    commonHandler(err);
                });
            }
        });
    }
    $onPropsChanged(props:any):void {
        const userListData = this.getValue(props,"adminUserList.data") || [];
        const userGroupData = this.getValue(props, "usersGroup.data") || [];
        const updateState:any = {};
        if(JSON.stringify(userListData) !== JSON.stringify(this.state.data)) {
            updateState.data = userListData;
        }
        if(JSON.stringify(userGroupData) !== JSON.stringify(this.state.groupData)) {
            updateState.groupData = userGroupData;
        }
        if(Object.keys(updateState).length > 0) {
            this.setState(updateState);
        }
    }
    render():any {
        return require("./index.html");
    }
}
