import { autowired, Component, declareComponent, redux, ElmerServiceRequest, IPropCheckRule, PropTypes } from "elmer-ui-core";
import { showToast, eAlert } from "../../../components";
import { createOfficeDataViewHeader , createOfficeDataViewPager ,TypeOfficeDataViewHeaderItem } from "../../../components/office/widget/dataView";

@redux.connect({
    mapStateToProps: (state:any) => ({
        ...(state.usersGroup || {})
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
        })
    };
    columns: TypeOfficeDataViewHeaderItem[][] = createOfficeDataViewHeader([[
        { title: "用户ID", dataKey: "id", style:"width:50px;" },
        { title: "登录账号", dataKey: "userLogin" },
        { title: "昵称", dataKey: "userName" },
        { title: "头像", dataKey: "header", render:(header:string) => {
            return !this.isEmpty(header) ? `<img style="width:50px;height:50px;" src="${header}" />` : "<span>未上传头像</span>";
        }},
        { title: "状态", dataKey: "status",
            style: "width: 50px",
            render:(status:number) => {
                return status === 1 ? "<span>正常</span>" : "<span style='color: gray;'>已禁用</span>";
            }
        }
    ]]);
    constructor(props:any) {
        super(props);
        this.state.data = this.getValue(props,"adminUserList.data") || [];
    }
    render():any {
        return require("./index.html");
    }
}
