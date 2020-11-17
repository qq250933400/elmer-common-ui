import { Component, defineGlobalVar, getUI } from "elmer-ui-core";
import { IMobileSelectedEvent } from "./IMobileSelect";
import { RegionData } from "./RegionData";

export interface IMobileRegionPickerOption {
    provinceTitle?: string;
    provinceData?: any[];
    cityTitle?: string;
    districtTitle?: string;
    onSelected?: Function;
    onClose?: Function;
    data?: any;
    defaultValue?: any[];
    title?: string;
}
export type TypeRegionPicker = Component & {
    show?: () => {};
    hide?: () => {};
};
export const createRegionPicker = (options?:IMobileRegionPickerOption): TypeRegionPicker => {
    const config:IMobileRegionPickerOption = {
        data: RegionData,
        provinceTitle: "省份",
        cityTitle: "城市",
        districtTitle: "县区",
        provinceData: RegionData.noCategoryProvince,
        defaultValue: [],
        title: ""
    };
    const ui = getUI();
    const parent = document.createElement("div");
    ui.extend(config, options);
    const provinceData = JSON.parse(JSON.stringify(config.provinceData || []));
    provinceData.splice(0,0,{
        title: config.provinceTitle,
        value: -1,
        disabled: true
    });
    const obj:any =  {
        visible: false,
        data: [provinceData],
        provinceKey: -1,
        cityKey: -1,
        defaultIndex: [],
        config,
        handleOnClose():void {
            this.setData({
                visible: false
            });
            typeof config.onClose === "function" && config.onClose();
        },
        handleOnOK(data:IMobileSelectedEvent): void {
            typeof config.onSelected === "function" && config.onSelected(data);
        },
        handleOnChanged(data: IMobileSelectedEvent): void {
            const tmpProvinceKey = data.selectedIndex[0];
            const tmpProvinceData = data.selectedItems[0];
            if(tmpProvinceKey !== this.provinceKey) {
                const tmpProvinceCode = tmpProvinceData.value;
                const cityData = JSON.parse(JSON.stringify(config.data[tmpProvinceCode] || []));
                const newData = JSON.parse(JSON.stringify(this.data || []));
                this.provinceKey = tmpProvinceKey;
                if(cityData.length>0) {
                    cityData.splice(0,0,{
                        title: config.cityTitle,
                        value: -1,
                        disabled: true
                    });
                    newData.splice(1,this.data.length-1,cityData);
                } else {
                    newData.splice(1,this.data.length-1);
                }
                this.setData({
                    data: newData
                });
            } else {
                const tmpCityKey = data.selectedIndex[1];
                const tmpCityData = data.selectedItems[1];
                if(this.cityKey !== tmpCityKey) {
                    const tmpCityCode = tmpCityData.value;
                    const districtData = JSON.parse(JSON.stringify(config.data[tmpCityCode] || []));
                    const newData = JSON.parse(JSON.stringify(this.data || []));
                    this.cityKey = tmpCityKey;
                    if(districtData.length>0) {
                        districtData.splice(0,0,{
                            title: config.districtTitle,
                            value: -1,
                            disabled: true
                        });
                        newData.splice(2,this.data.length-2,districtData);
                    } else {
                        newData.splice(2,this.data.length-2);
                    }
                    this.setData({
                        data: newData
                    });
                }
            }
        },
        show: (): void => {
            obj.setData({
                visible: true
            });
        },
        hide: (): void => {
            obj.setData({
                visible: false
            });
        }
    };
    const initData = () => {
        const defaultValue = config.defaultValue || [];
        const tmpProvinceCode = defaultValue[0] || "";
        const tmpCityCode = defaultValue[1] || "";
        const tmpDistrictCode = defaultValue[2] || "";
        const updateData = [];
        const updateIndex = [];
        let cityData = [];
        let districtData = [];
        updateData.push(JSON.parse(JSON.stringify(provinceData)));
        if(!ui.isEmpty(tmpProvinceCode)) {
            for(let key=0; key<provinceData.length;key++) {
                if(provinceData[key].value === tmpProvinceCode) {
                    cityData = config.data[tmpProvinceCode];
                    updateIndex.push(key);
                    obj.provinceKey = key;
                    break;
                }
            }
            if(!ui.isEmpty(tmpCityCode) && cityData.length>0) {
                for(let key=0; key<cityData.length;key++) {
                    if(cityData[key].value === tmpCityCode) {
                        districtData = config.data[tmpCityCode];
                        updateIndex.push(key);
                        obj.cityKey = key;
                        break;
                    }
                }
                updateData.push(JSON.parse(JSON.stringify(cityData)));
                if(!ui.isEmpty(tmpDistrictCode) && districtData.length>0) {
                    for(let key=0; key<districtData.length;key++) {
                        if(districtData[key].value === tmpDistrictCode) {
                            updateIndex.push(key);
                            break;
                        }
                    }
                    updateData.push(JSON.parse(JSON.stringify(districtData)));
                }
            }
        }
        obj.defaultIndex = updateIndex;
        obj.data = updateData;
    };
    initData(); // 初始化默认选择内容
    ui.render(parent, "<eui-mobile-select title='{{config.title}}' defaultValue='{{defaultIndex}}' data='{{data}}' visible='{{visible}}' et:onOk='handleOnOK' et:onClose='handleOnClose' et:onChange='handleOnChanged'/>", obj);
    document.body.appendChild(parent);
    return obj;
};

defineGlobalVar("createRegionPicker", createRegionPicker);
