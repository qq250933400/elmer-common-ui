import { StaticCommon } from "elmer-common";
import { showToast } from "../components";

/**
 * 错误统一处理方法，遇到错误结果返回true,否则返回undefined或者true
 * @param resp 返回数据
 * @param errorResponse 检查数据是否是http错误数据, true， 查询不到错误信息，自定义默认数据
 */
export const commonHandler = (resp:any, errorResponse?: boolean): any => {
    if(resp.statusCode !== 200) {
        if(!StaticCommon.isEmpty(resp.statusCode)) {
            const msg = resp.message || resp.info || resp.statusText || "请求失败";
            showToast​​(msg + ` (${resp.statusCode})`);
            return true;
        } else {
            if(!StaticCommon.isEmpty(resp.success) && !resp.success) {
                const msg = resp.message || resp.info || resp.statusText || "请求失败";
                showToast​​(msg);
                return true;
            }
        }
    }
    if(errorResponse) {
        const msg = resp.message || resp.info || resp.statusText || "请求失败";
        showToast​​(msg);
        return true;
    }
};
