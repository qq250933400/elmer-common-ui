import { Component,declareComponent, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import { RegionData } from "../mobileSelect/RegionData";
import "./style.less";

@declareComponent({
    selector: "PcRegionPicker"
})
export class PcRegionPicker extends Component {
    static propTypes:any = {
        defaultValue: {
            defaultValue: [],
            description: "默认RegionCode",
            rule: propTypes.array
        },
        id: <IPropCheckRule> {
            description: "组件ID",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        name: <IPropCheckRule> {
            description: "组件name",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        disabled: <IPropCheckRule> {
            defaultValue: false,
            description: "是否禁止",
            rule: propTypes.boolean
        },
        theme: <IPropCheckRule> {
            defaultValue: "",
            description: "样式",
            rule: propTypes.string
        },
        placeholder: <IPropCheckRule> {
            defaultValue: "请选择",
            description: "placeholder",
            rule: propTypes.string
        },
        tabIndex: <IPropCheckRule> {
            defaultValue: 0,
            description: "tabIndex",
            rule: propTypes.number.isRequired
        },
        onChanged:<IPropCheckRule> {
            description: "Change事件",
            rule: propTypes.func
        },
        title: <IPropCheckRule> {
            defaultValue: ["省份", "城市", "县区"],
            description: "标题",
            rule: propTypes.array
        },
        availableCode: <IPropCheckRule> {
            defaultValue: [],
            description: "有效显示地区代码",
            rule: propTypes.array
        },
        data: <IPropCheckRule> {
            description: "自定义选择数据",
            rule: propTypes.any
        },
        style: <IPropCheckRule> {
            defaultValue: "",
            description: "内联样式",
            rule: propTypes.string.isRequired
        }
    };
    state: any = {
        dropListVisible: false,
        hasFocus: false,
        selectedTab: "0"
    };
    displayData: any [] = [];
    provinceData: any[] = RegionData.categoryProvince;
    cityData: any[] = [];
    districtData: any = [];
    proviceTitle: string = "省份";
    cityTitle: string = "城市";
    districtTitle: string = "县区";
    selectedProvince: any = {};
    selectedCity: any = {};
    selectedDistrict: any = {};
    placeholder: string = "";
    displayValue: string = "";
    sourceData: any = RegionData;
    constructor(props:any) {
        super(props);
        if(props.title) {
            this.proviceTitle = props.title[0];
            this.cityTitle = props.title[1];
            this.districtTitle = props.title[2];
        }
        this.placeholder = !this.isEmpty(props.placeholder) ? props.placeholder : "请选择";
        if(props.data && Object.keys(props.data).length>0) {
            this.sourceData = props.data;
            this.provinceData = this.sourceData.categoryProvince;
        }
        this.updateDefaultValue();
        this.updateDisplayData(true);
    }
    $onPropsChanged(props:any): void {
        if(props.data && Object.keys(props.data).length>0) {
            this.sourceData = props.data;
            this.provinceData = this.sourceData.categoryProvince;
        }
        this.updateDefaultValue();
        this.updateDisplayData();
    }
    handleOnBodyClick(evt: IElmerEvent):void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            dropListVisible: false,
            hasFocus: false,
        });
    }
    checkIconVisible(iconValue: string): string {
        const visibleClassName = this.isEmpty(iconValue) ? "eui-inline-hidden" : "eui-inline-block";
        return visibleClassName;
    }
    handleOnTabClick(evt:IElmerEvent): void {
        const id = evt.target.getAttribute("data-id");
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            selectedTab: id
        });
    }
    handleOnDisplayTitleClick(evt:IElmerEvent): void {
        const id:any = evt.target.getAttribute("data-id");
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            dropListVisible: true,
            selectedTab: !isNaN(id) && !this.isEmpty(id) ? id : "0"
        });
    }
    handleOnProvinceClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.state.selectedTab = "1";
        this.setData({
            selectedProvince: evt.data.provice,
            cityData: this.sourceData[evt.data.provice.value] || [],
            districtData: [],
            selectedDistrict: {},
            selectedCity: {}
        });
        this.updateDisplayData();
    }
    handleOnCityClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.state.selectedTab = "2";
        this.setData({
            selectedCity: evt.data.city,
            districtData: this.sourceData[evt.data.city.value] || [],
            selectedDistrict: {}
        });
        this.updateDisplayData();
    }
    handleOnDistrictClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.state.dropListVisible = false;
        this.state.hasFocus = false;
        this.setData({
            selectedDistrict: evt.data.district
        });
        this.updateDisplayData();
        typeof this.props.onChanged === "function" && this.props.onChanged({
            data: this.displayData,
            id: this.props.id,
            name: this.props.name
        });
    }
    handleOnClick(): void {
        if(!this.props.disabled) {
            this.setState({
                dropListVisible: true,
                hasFocus: true
            });
        }
    }
    render(): string {
        return require("./pcRegionPicker.html");
    }
    $after(): void {
        this.addEvent(this, document.body, "click", this.handleOnBodyClick);
    }
    getData(): any[] {
        return this.displayData;
    }
    reset(): void {
        this.selectedProvince = null;
        this.selectedCity = null;
        this.selectedDistrict = null;
        this.updateDisplayData();
    }
    private updateDisplayData(setDataDirect?: boolean): void {
        const result  = [];
        // tslint:disable-next-line:variable-name
        let _displayValue = "";
        if(this.selectedProvince && !this.isEmpty(this.selectedProvince.value)) {
            result.push({
                title: this.selectedProvince.title,
                value: this.selectedProvince.value,
                index: result.length
            });
            _displayValue = this.selectedProvince.value;
        }
        if(this.selectedCity && !this.isEmpty(this.selectedCity.value)) {
            result.push({
                title: this.selectedCity.title,
                value: this.selectedCity.value,
                index: result.length
            });
            _displayValue += "|" + this.selectedCity.value;
        }
        if(this.selectedDistrict && !this.isEmpty(this.selectedDistrict.value)) {
            result.push({
                title: this.selectedDistrict.title,
                value: this.selectedDistrict.value,
                index: result.length
            });
            _displayValue += "|" + this.selectedDistrict.value;
        }
        if(!setDataDirect) {
            this.setData({
                displayData: result,
                displayValue: _displayValue
            });
        } else {
            this.displayData = result;
            this.displayValue = _displayValue;
        }
    }
    private updateDefaultValue(): void {
        if(this.props.defaultValue && this.props.defaultValue.length>0) {
            const defaultProvice = this.props.defaultValue[0];
            for(const tmpProvice of this.provinceData) {
                if(this.isArray(tmpProvice.data)) {
                    for(const tmpProviceData of tmpProvice.data) {
                        // tslint:disable-next-line:triple-equals
                        if(tmpProviceData.value == defaultProvice) {
                            this.selectedProvince = {
                                value: tmpProviceData.value,
                                title: tmpProviceData.title
                            };
                            this.cityData = this.sourceData[defaultProvice] || [];
                            break;
                        }
                    }
                } else {
                    // tslint:disable-next-line:triple-equals
                    if(tmpProvice.value == defaultProvice) {
                        this.selectedProvince = {
                            value: tmpProvice.value,
                            title: tmpProvice.title
                        };
                        this.cityData = this.sourceData[defaultProvice] || [];
                        break;
                    }
                }
            }
            const defaultCity = this.props.defaultValue[1];
            if(this.cityData && this.cityData.length>0) {
                for(const tmpCity of this.cityData) {
                    // tslint:disable-next-line:triple-equals
                    if(tmpCity.value == defaultCity) {
                        this.selectedCity = {
                            value: tmpCity.value,
                            title: tmpCity.title
                        };
                        this.districtData = this.sourceData[defaultCity];
                        break;
                    }
                }
            }
            const defaultDistrict = this.props.defaultValue[2];
            if(this.districtData && this.districtData.length>0) {
                for(const tmpDistrict of this.districtData) {
                    // tslint:disable-next-line:triple-equals
                    if(tmpDistrict.value == defaultDistrict) {
                        this.selectedDistrict = {
                            value: tmpDistrict.value,
                            title: tmpDistrict.title
                        };
                        break;
                    }
                }
            }
        } else {
            this.selectedProvince = null;
            this.selectedCity = null;
            this.selectedDistrict = null;
        }
    }
}
