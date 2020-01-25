import { Common } from "elmer-common";
import { autowired, ElmerServiceRequest, Injectable } from "elmer-ui-core";
import { showToast } from "../toast";

@Injectable("UploadModel")
export class UploadModel extends Common {
    handleFail: Function;
    handleSuccess: Function;
    uploadAction: string;
    formName: string;

    @autowired(ElmerServiceRequest)
    private service: ElmerServiceRequest;
    appendUpload(fileObj: any, fileIndex: number, sender: any): void {
        const uploadAction = (file: any, index: number, component: any) => {
            let sData = JSON.parse(JSON.stringify(component.state.fileList || []));
            const formData = new FormData();
            formData.append(this.formName, file);
            this.service.sendRequest({
                url: this.uploadAction,
                type: "POST",
                data: formData,
                header: {
                    "content-type": "multipart/form-data"
                },
                uploadProgress: (evt: ProgressEvent) => {
                    sData = JSON.parse(JSON.stringify(component.state.fileList || []));
                    sData[index].percent = Math.ceil(evt.loaded / evt.total * 100) + "%";
                    component.setState({
                        fileList: sData
                    });
                }
            }).then((resp: any) => {
                let success = false;
                let url = "";
                let displayUrl = "";
                const valueKey = this["valueKey"];
                if (typeof this.handleSuccess === "function") {
                    const result = this.handleSuccess(resp);
                    success = result.success;
                    url = result.url;
                    displayUrl = result.disUrl;
                } else {
                    if (resp.success) {
                        success = true;
                        url = resp[valueKey];
                        displayUrl = resp.url;
                    }
                }
                if (success) {
                    sData = JSON.parse(JSON.stringify(component.state.fileList || []));
                    sData[index].url = displayUrl;
                    sData[index].value = url;
                    sData[index].showProg = false;
                    if (/\.(jpg|jpeg|gif|bmp|png)$/i.test(displayUrl)) {
                        sData[index].header = displayUrl;
                    }
                    component.setState({
                        fileList: sData,
                        choseable: true
                    });
                } else {
                    this.onError(index, resp.info || resp.message || "上传文件失败");
                    component.setState({
                        choseable: true
                    });
                }
            }).catch((err) => {
                this.onError(index, err.statusText || err.message || "上传文件失败");
                component.setState({
                    choseable: true
                });
                // tslint:disable-next-line:no-console
                console.error(err);
            });
        };
        return new uploadAction(fileObj, fileIndex, sender);
    }
    onError(index: number, msg: string): void {
        if (typeof this.handleFail === "function") {
            this.handleFail(index, msg);
        } else {
            showToast("Upload Error: [" + index + "]" + msg);
        }
        // tslint:disable-next-line:no-console
        console.log("Upload Error: [" + index + "]", msg);
    }
}
