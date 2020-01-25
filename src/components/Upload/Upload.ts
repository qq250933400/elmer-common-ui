import { autowired,Component,declareComponent,ElmerServiceRequest, IElmerEvent, propTypes } from "elmer-ui-core";
import { UploadModel } from "./UploadModel";

@declareComponent({
    selector: "Upload",
    model: {
        obj: UploadModel
    }
})
export class UploadComponent extends Component {
    static propType: any = {
        theme: {
            defaultValue: "",
            description: "样式",
            rule: propTypes.string
        },
        style: {
            defaultValue: "",
            description: "内联样式",
            rule: propTypes.string
        },
        listType: {
            defaultValue: "item",
            description: "列表样式",
            rule: propTypes.oneValueOf(["list", "item"]).isRequired
        },
        multi: {
            defaultValue: false,
            description: "是否多文件",
            rule: propTypes.boolean
        },
        domain: {
            defaultValue: ".",
            description: "文件类型图片域名",
            rule: propTypes.string
        },
        action: {
            defaultValue: "http://39.105.32.169/data/User/admin/home/document/nanjin_tianyi/public/index.php/tianyi/apply/upload",
            description: "文件类型图片域名",
            rule: propTypes.string.isRequired
        },
        formName: {
            defaultValue: "uploadFile",
            description: "form name",
            rule: propTypes.string.isRequired
        },
        handleSuccess: {
            description: "上传成功结果分析，需要返回url和disUrl, 给组件自动处理结果显示",
            rule: propTypes.func
        },
        handleFail: {
            description: "上传失败",
            rule: propTypes.func
        },
        accept: {
            defaultValue: "image/*",
            description: "接受文件类型",
            rule: propTypes.string
        },
        valueName: {
            defaultValue: "abUrl",
            description: "Response获取value的key值",
            rule: propTypes.string
        },
        fileList: {
            defaultValue: [],
            description: "默认已有文件列表",
            rule:propTypes.array
        }
    };
    state:any = {
        showAdd: true,
        choseable: true,
        fileList: []
    };
    theme: string = "";
    private fileTypeIcons: any = {
        bmp  : "/assets/icon_file_bmp.png",
        docx : "/assets/fileType/icon_file_docx.png",
        doc  : "/assets/fileType/icon_file_doc.png",
        exe  : "/assets/fileType/icon_file_exe.png",
        gif  : "/assets/fileType/icon_file_gif.png",
        jpeg : "/assets/fileType/icon_file_jpeg.png",
        jpg  : "/assets/fileType/icon_file_jpg.png",
        pdf  : "/assets/fileType/icon_file_pdf.png",
        none : "/assets/fileType/icon_file_none.png",
        png  : "/assets/fileType/icon_file_png.png",
        ppt  : "/assets/fileType/icon_file_ppt.png",
        pptx : "/assets/fileType/icon_file_pptx.png",
        rar  : "/assets/fileType/icon_file_rar.png",
        tif  : "/assets/fileType/icon_file_tif.png",
        txt  : "/assets/fileType/icon_file_txt.png",
        xls  : "/assets/fileType/icon_file_xls.png",
        xlsx : "/assets/fileType/icon_file_xlsx.png",
        zip  : "/assets/fileType/icon_file_zip.png",
    };
    private fileID: string = this.getRandomID();
    private defaultFileList: any[] = [];
    constructor(props: any) {
        super(props);
        this.theme = props.theme || "";
        this.defaultFileList = props.fileList || [];
        this.updateDefaultFileList();
    }
    $inject(): void {
        const valueKey = this.props.valueName || "abUrl";
        this.defineReadOnlyProperty(this.model.obj, "setState", this.setState.bind(this));
        this.defineReadOnlyProperty(this.model.obj, "uploadAction", this.props.action);
        this.defineReadOnlyProperty(this.model.obj, "formName", this.props.formName);
        this.defineReadOnlyProperty(this.model.obj, "handleSuccess", this.props.handleSuccess);
        this.defineReadOnlyProperty(this.model.obj, "handleFail", this.props.handleFail);
        this.defineReadOnlyProperty(this.model.obj, "valueKey", valueKey);
    }
    updateDefaultFileList(refresh?:boolean): void {
        const fileList = this.defaultFileList || [];
        const newFileList = [];
        for(const tmpFile of fileList) {
            const isImage = /\.(jpg|jpeg|gif|bmp|png)$/i.test(tmpFile.url);
            newFileList.push({
                name: tmpFile.name,
                size: !this.isEmpty(tmpFile.size) ? tmpFile.size : "",
                header: isImage ? tmpFile.url : this.getFileTypeIcon(tmpFile.url),
                showProg: false,
                percent: 0,
                url: tmpFile.url,
                value: !this.isEmpty(tmpFile.value) ? tmpFile.value : tmpFile.url
            });
        }
        if(refresh) {
            this.setState({
                fileList: newFileList
            });
        } else {
            this.state.fileList = newFileList;
        }
    }
    $onPropsChanged(newProps: any): void {
        this.defaultFileList = newProps.fileList || [];
        this.theme = newProps.theme || "";
        this.updateDefaultFileList(true);
    }
    handleOnUploadClick(): void {
        const dom = this.dom[this.fileID];
        if(this.state.choseable) {
            dom.click();
        }
    }
    handleOnFileChanged(evt:IElmerEvent): void {
        const files:any = (<HTMLInputElement>evt.target).files;
        const newFileList = this.props.multi ? JSON.parse(JSON.stringify(this.state.fileList || [])) : [];
        if(files && files.length>0) {
            for(const file of files) {
                newFileList.push({
                    name: (file.name||"").replace(/\.[a-z0-9]*$/,""),
                    header: this.getFileTypeIcon(file.name),
                    size: this.calcFileSize(file.size),
                    url: "~/fackpath/" + file.name,
                    showProg: true,
                    percent: 0
                });
                this.model.obj.appendUpload(file, newFileList.length - 1, this);
            }
            this.setState({
                fileList: newFileList,
                choseable: newFileList.length>1
            });
        }
    }
    getData(): any {
        if(this.props.multi) {
            const result = [];
            for(const tmpFile of this.state.fileList) {
                result.push((tmpFile.value || tmpFile.url));
            }
            return result;
        } else {
            return this.state.fileList && this.state.fileList[0] ? (this.state.fileList[0].value || this.state.fileList[0].url): "";
        }
    }
    reset(): void {
        this.defaultFileList = [];
        this.updateDefaultFileList(true);
    }
    render(): string {
        return require("./index.html");
    }
    private calcFileSize(fileSize:number): string {
        let result = fileSize + "Byte";
        if(fileSize<1024) {
            result = fileSize.toFixed(2) + "Byte";
        } else if(fileSize>=1024 && fileSize<Math.pow(1024,2)) {
            result = (fileSize/1024).toFixed(2) + "KB";
        } else if(fileSize>=Math.pow(1024,2) && fileSize<Math.pow(1024,3)) {
            result = (fileSize/1024/1024).toFixed(2) + "M";
        } else if(fileSize>=Math.pow(1024,3) && fileSize<Math.pow(1024,4)) {
            result = (fileSize/1024/1024/1024).toFixed(2) + "G";
        } else if(fileSize>=Math.pow(1024,4)) {
            result = (fileSize/1024/1024/1024/1024).toFixed(2) + "GB";
        }
        return result;
    }
    private getFileTypeIcon(fileName:string): string {
        let fileType = "none";
        const checkFileName = fileName || "";
        const lIndex = checkFileName.lastIndexOf(".");
        if(lIndex>=0) {
            fileType = checkFileName.substr(lIndex+1).toLowerCase();
        }
        const fileTypeIcon = !this.isEmpty(this.fileTypeIcons[fileType]) ? this.fileTypeIcons[fileType] : "/assets/fileType/icon_file_none.png";
        return this.props.domain + fileTypeIcon;
    }
}
