import { autowired, Component, declareComponent,ElmerDOM, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import "./style/index.less";

export interface ICalendarDate {
    text?: string;
    value?: string|number;
    year?: string|number;
    month?: string|number;
    date?: string|number;
    week?: number;
    disabled?: boolean;
    theme?: string;
    checked?: boolean;
    isToday?: boolean;
}

export interface ICalendarWeek {
    data: ICalendarDate[];
    index: string;
}

export enum EnumCalendarSelectMode {
    Single   = "Single",
    Multiple = "Multiple",
    Range    = "Range"
}

@declareComponent({
    selector: "calendar"
})
export class CalendarComponent extends Component {
    static propType: any = {
        theme: <IPropCheckRule>{
            defaultValue: "",
            description: "样式",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        style:<IPropCheckRule>{
            defaultValue: "",
            description: "内联样式",
            rule: propTypes.oneOf([propTypes.string, propTypes.number])
        },
        date: {
            defaultValue: new Date(),
            description: "当前日期",
            rule: propTypes.date.isRequired
        },
        showTimePicker: {
            defaultValue: false,
            description: "显示时间选择",
            rule: propTypes.bool.isRequired
        },
        weekendTitle: {
            defaultValue: [],
            description: "星期几标题",
            rule: propTypes.array
        },
        monthTitle: {
            defaultValue: [],
            description: "月份标题",
            rule: propTypes.array
        },
        tagTodayText: {
            defaultValue: "Today",
            description: "今日标签文本",
            rule: propTypes.string
        },
        tagSelectText: {
            defaultValue: "Select",
            description: "选择标签文本",
            rule: propTypes.string
        },
        selectMode: {
            defaultValue: EnumCalendarSelectMode.Single,
            description: "选择标签文本",
            rule: propTypes.oneValueOf([EnumCalendarSelectMode.Single,EnumCalendarSelectMode.Multiple, EnumCalendarSelectMode.Range])
        },
        selectedDate: {
            defaultValue: [],
            description: "选择的日期",
            rule: propTypes.array.isRequired
        },
        choseTimeTitle: {
            defaultValue: "Chose Time",
            description: "选择时间标题",
            rule: propTypes.string.isRequired
        },
        onOutClick: {
            description: "日历外点击事件",
            rule: propTypes.func
        },
        onChange: {
            description: "选择变化事件",
            rule: propTypes.func
        },
        onClick: {
            description: "点击事件",
            rule: propTypes.func
        }
    };
    style: string = "";
    week: string  = "Monday";
    year: string  = "2019";
    month: string = "";
    date: string = "7";
    allWeekTitle: any[] = [
        { title: "Sun", value: "Sun" },
        { title: "Mon", value: "Mon" },
        { title: "Tue", value: "Tue" },
        { title: "Wed", value: "Wed" },
        { title: "Thu", value: "Thu" },
        { title: "Fri", value: "Fri" },
        { title: "Sat", value: "Sat" }
    ];
    monthText: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    todayText: string = "Today";
    selectText: string = "Select";
    todayTheme: string = "eui-calendar-today";
    selectedTheme: string = "eui-calendar-checked";
    selectedDate: string[] = [];
    nextDate: Date;
    nextMonthData: ICalendarWeek[] = [];
    nextStyle: string = "left: 100%;";
    nextAnimation: string = "";
    nextMonthText: string = "";
    nextID: string = this.getRandomID();
    currentID: string = this.getRandomID();
    currentMonthData: ICalendarWeek[] = [];
    currentDate: Date;
    currentAnimation: string = "";
    currentStyle: string = "";
    isAnimation: boolean = false;
    selectMode: string = EnumCalendarSelectMode.Single;
    state: any = {
        choseTimeTitle: "",
        choseHourListData: [],
        choseMinuteListData: [],
        choseHour: "",
        choseMinute: "",
        timeAnimation: ""
    };
    timeID: string = this.getRandomID();
    timeHourID: string = this.getRandomID();
    timeMinuteID: string = this.getRandomID();
    showTimePicker: boolean = false;

    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props:any) {
        super(props);
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        this.currentDate = props.date;
        this.style = !this.isEmpty(props.style) ? props.style : "";
        this.currentMonthData = this.calcCalendarData(this.currentDate);
        this.selectedDate = props.selectedDate || [];
        if(props.weekendTitle && props.weekendTitle.length>0) {
            this.allWeekTitle = props.weekendTitle;
        }
        if(props.monthTitle && props.monthTitle.length>0) {
            this.monthText = props.monthTitle;
        }
        this.state.choseHour = hour > 9 ? hour.toString() : "0" + hour;
        this.state.choseMinute = minute > 9 ? minute.toString() : "0" + minute;
        this.state.choseTimeTitle = props.choseTimeTitle;
        this.state.choseHourListData = this.getTimeListData(24);
        this.state.choseMinuteListData = this.getTimeListData(60);
        this.todayText = !this.isEmpty(props.tagTodayText) ? props.tagTodayText : "Today";
        this.selectText = !this.isEmpty(props.tagSelectText) ? props.tagSelectText : "Select";
        this.month = this.monthText[this.currentDate.getMonth()];
        this.showTimePicker = props.selectMode === EnumCalendarSelectMode.Single && props.showTimePicker;
    }
    $onPropsChanged(newProps: any): void {
        const updateData: any = {
            currentDate: newProps.date || (new Date()),
            currentMonthData: this.calcCalendarData(newProps.date || (new Date())),
            showTimePicker:  newProps.selectMode === EnumCalendarSelectMode.Single && newProps.showTimePicker
        };
        if(newProps.weekendTitle && newProps.weekendTitle.length>0) {
            updateData.allWeekTitle = newProps.weekendTitle;
        }
        if(newProps.monthTitle && newProps.monthTitle.length>0) {
            updateData.monthText = newProps.monthTitle;
        }
        if(!this.isEmpty(newProps.tagTodayText)) {
            updateData.todayText = newProps.tagTodayText;
        }
        if(!this.isEmpty(newProps.tagSelectText)) {
            updateData.selectText = newProps.tagSelectText;
        }
        if(!this.isEmpty(newProps.style)) {
            updateData.style = newProps.style || "";
        }
        if(this.isArray(newProps.selectedDate)) {
            updateData.selectedDate = newProps.selectedDate;
        }
        this.setData(updateData, true);
    }
    $after(): void {
        this.addEvent(this, document.body, "click", this.handleOnBodyClick);
    }
    handleOnBodyClick(): void {
        typeof this.props.onOutClick === "function" && this.props.onOutClick();
    }
    onCalendarClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
    }
    handleOnCurrentAnimationEnd(): void {
        const currentStyle = "left: 0;transform:translateX(0);-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);";
        const nextStyle = "left: 100%;transform:translateX(0);-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);";
        this.setData({
            currentAnimation: "",
            currentStyle,
            nextAnimation: "",
            nextStyle,
            currentMonthData: this.calcCalendarData(this.currentDate),
            year: this.currentDate.getFullYear(),
            month: this.monthText[this.currentDate.getMonth()],
            isAnimation: false
        });
    }
    render(): string {
        return require("./views/index.html");
    }
    handleOnToPrevMonth(evt: IElmerEvent): void {
        if(!this.isAnimation) {
            const curDate = new Date(this.currentDate.toDateString());
            curDate.setMonth(curDate.getMonth()-1);
            const data = this.calcCalendarData(curDate);
            const nextStyle = "left: 0;transform:translateX(-100%);-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);-ms-transform:translateX(-100%);";
            this.setData({
                currentDate: curDate,
                nextMonthData: data,
                nextMonthText: this.monthText[curDate.getMonth()],
                currentAnimation: "aniCalendarToPrev1",
                nextAnimation: "aniCalendarToPrev2",
                nextStyle,
                isAnimation: true
            });
        }
    }
    handleOnToNextMonth(evt: IElmerEvent): void {
        if(!this.isAnimation) {
            const curDate = new Date(this.currentDate.toDateString());
            curDate.setMonth(curDate.getMonth()+1);
            const data = this.calcCalendarData(curDate);
            const nextStyle = "left: 100%;transform:translateX(0);-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);";
            this.setData({
                currentDate: curDate,
                nextMonthData: data,
                nextMonthText: this.monthText[curDate.getMonth()],
                currentAnimation: "aniCalendarToNext1",
                nextAnimation: "aniCalendarToNext2",
                isAnimation: true,
                nextStyle
            });
        }
    }
    handleOnCalendarClick(evt:IElmerEvent): void {
        const date: any = evt.data.curDate;
        const dateValue: string = date.value;
        const selectedData = this.selectedDate || [];
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        if(this.props.selectMode !== EnumCalendarSelectMode.Single) {
            if(!date.disabled) {
                const dateIndex = selectedData.indexOf(dateValue);
                if(dateIndex>=0) {
                    selectedData.splice(dateIndex, 1);
                } else {
                    selectedData.push(dateValue);
                }
                this.checkSelectedDateStatus("currentMonthData");
            }
        } else {
            this.selectedDate = [dateValue];
            this.checkSelectedDateStatus("currentMonthData");
            if(!this.props.showTimePicker) {
                typeof this.props.onChange === "function" && this.props.onChange(this.selectedDate);
            }
        }
        typeof this.props.onClick === "function" && this.props.onClick();
    }
    handleOnTimeHourClick(): void {
        if(this.isEmpty(this.state.timeAnimation)) {
            this.setState({
                timeAnimation: "aniCalendarTimeShow"
            });
        } else {
            this.setState({
                timeAnimation: ""
            });
        }
    }
    handleOnTimeMinuteClick(): void {
        if(this.isEmpty(this.state.timeAnimation)) {
            this.setState({
                timeAnimation: "aniCalendarTimeShow"
            });
        } else {
            this.setState({
                timeAnimation: ""
            });
        }
    }
    handleOnTimeHourListItemClick(evt:IElmerEvent): void {
        this.setState({
            choseHour: evt.data.time.value
        });
    }
    handleOnTimeMinuteListItemClick(evt:IElmerEvent): void {
        const minute = evt.data.time.value;
        if(this.props.selectMode === EnumCalendarSelectMode.Single) {
            if(this.selectedDate.length>0) {
                const selectedDate = this.selectedDate[0];
                const time = this.state.choseHour + ":" + minute + ":00";
                const result = selectedDate + " " + time;
                this.selectedDate = [result];
                typeof this.props.onChange === "function" && this.props.onChange([result]);
            }
        }
        this.setState({
            choseMinute: evt.data.time.value,
            timeAnimation: ""
        });
    }
    getData(): any[] {
        return this.selectedDate;
    }
    private checkSelectedDateStatus(checkListKey: string, returnData?: boolean): ICalendarWeek[] {
        const checkData:ICalendarWeek[] = this.isArray(this[checkListKey]) ? this[checkListKey] : [];
        checkData.map((tmpWeek:ICalendarWeek, weekIndex: number) => {
            tmpWeek.data.map((tmpDate:ICalendarDate, dateIndex: number) => {
                if(this.selectedDate.indexOf(tmpDate.value.toString())>=0) {
                    checkData[weekIndex].data[dateIndex].checked = true;
                    checkData[weekIndex].data[dateIndex].theme =  this.selectedTheme;
                } else {
                    checkData[weekIndex].data[dateIndex].checked = false;
                    checkData[weekIndex].data[dateIndex].theme = tmpDate.isToday ? this.todayTheme : "";
                }
            });
        });
        if(!returnData) {
            const updateData = {};
            updateData[checkListKey] = checkData;
            this.setData(updateData, true);
        }
        return checkData;
    }
    private calcCalendarData(updateDate: Date): ICalendarWeek[] {
        const rows = 6;
        const cols  = 7;
        const curDate = this.getType(updateDate) === "[object Date]" ? updateDate : new Date();
        const year = curDate.getFullYear(), month = curDate.getMonth();
        const firstDateText = [year, month+1,"1"].join("/");
        const firstDate = new Date(firstDateText);
        const firstWeek = firstDate.getDay();
        const resultData: ICalendarWeek[] = [];
        let dateCount = 30, checkIndex = 0, startIndex = 0;

        firstDate.setMonth(month + 1);
        firstDate.setDate(0);
        dateCount = firstDate.getDate();
        for(let i=0;i<rows;i++) {
            const tmpRowData:ICalendarWeek = {
                data: [],
                index: i.toString()
            };
            for(let j=0;j<cols;j++) {
                if(checkIndex >= firstWeek && startIndex<dateCount) {
                    const curDateValue = (checkIndex - firstWeek + 1);
                    let curDateMonth:any = month+1;
                    curDateMonth = curDateMonth > 9 ? curDateMonth : "0" + curDateMonth;
                    const dateStr = [year, curDateMonth, (curDateValue >9 ? curDateValue : "0" + curDateValue)].join("/");
                    const checkStatus = this.checkDateStatus(new Date(dateStr), dateStr);
                    tmpRowData.data.push({
                        theme: checkStatus.theme,
                        value: dateStr,
                        text: curDateValue.toString(),
                        year,
                        month: parseInt(curDateMonth.toString(), 10),
                        date: parseInt(curDateValue.toString(), 10),
                        week: j,
                        disabled: false,
                        isToday: checkStatus.isToday
                    });
                    startIndex += 1;
                } else {
                    if(checkIndex<firstWeek) {
                        const prevDate = this.getPrevMonthData(new Date(firstDateText),checkIndex - firstWeek);
                        prevDate.disabled = true;
                        tmpRowData.data.push(prevDate);
                    } else {
                        const nextDate = this.getNextMonthData(new Date(firstDateText), checkIndex - startIndex - firstWeek + 1);
                        nextDate.disabled = true;
                        tmpRowData.data.push(nextDate);
                    }
                }
                checkIndex += 1;
            }
            resultData.push(tmpRowData);
        }
        return resultData;
    }
    private getPrevMonthData(curDate:Date, effectValue: number): ICalendarDate {
        curDate.setDate(1);
        const prevDate:Date = new Date();
        prevDate.setTime(curDate.getTime());
        prevDate.setDate(prevDate.getDate() + effectValue);
        const month = prevDate.getMonth() + 1;
        const year = prevDate.getFullYear();
        let date:any = prevDate.getDate();
        date = date > 9 ? date.toString() : "0" + date;
        const dateStr = [year, (month > 9 ? month : "0" + month), date].join("/");
        const checkStatus = this.checkDateStatus(new Date(dateStr), dateStr);
        return <ICalendarDate>{
            theme: checkStatus.theme,
            value: dateStr,
            text: date,
            year,
            month,
            date: parseInt(date,10),
            week: (new Date([year, month, date].join("/"))).getDay(),
            isToday: checkStatus.isToday
        };
    }
    private getNextMonthData(curDate: Date, effectValue: number): ICalendarDate {
        const nextDate = new Date();
        nextDate.setTime(curDate.getTime());
        nextDate.setMonth(nextDate.getMonth() + 1);
        nextDate.setDate(0);
        nextDate.setDate(nextDate.getDate()+effectValue);
        const year = nextDate.getFullYear();
        const month = nextDate.getMonth() + 1;
        const date = nextDate.getDate();
        const dateStr = [year, (month > 9 ? month : "0" + month), (date > 9 ? date : "0" + date)].join("/");
        const checkStatus = this.checkDateStatus(new Date(dateStr), dateStr);
        return <ICalendarDate>{
            theme: checkStatus.theme,
            value: dateStr,
            text: effectValue.toString(),
            year,
            month,
            date: effectValue,
            week: (new Date(dateStr)).getDay(),
            isToday: checkStatus.isToday
        };
    }
    private checkDateStatus(checkDate:Date, dateStr: string): any {
        const now = new Date();
        const result = {
            theme: "",
            isToday: false
        };
        if(now.getFullYear() === checkDate.getFullYear() && now.getMonth() === checkDate.getMonth() && now.getDate() === checkDate.getDate()) {
            result.theme = this.todayTheme;
            result.isToday = true;
        }
        if(this.selectedDate.indexOf(dateStr)>=0) {
            result.theme = this.selectedTheme;
        }
        return result;
    }
    private getTimeListData(maxValue: number = 12): any[] {
        const maxI = maxValue > 0 ? maxValue : 12;
        const result = [];
        for(let i=1;i<=maxI;i++) {
            result.push({
                value: i< 10 ? "0" + i : i.toString()
            });
        }
        result[result.length-1] = {
            value: "00"
        };
        return result;
    }
    private handleOnTimeDomAnimationEnd(): void {
        if(!this.isEmpty(this.state.timeAnimation)) {
            const hourDom:HTMLElement = this.dom[this.timeHourID];
            const minuteDom = this.dom[this.timeMinuteID];
            const hourActiveDom = this.$.find(hourDom, ".active")[0];
            const minuteActiveDom = this.$.find(minuteDom, ".active")[0];
            if(hourActiveDom && hourDom.scrollTop < 10) {
                const cHeight = hourActiveDom.clientHeight;
                let key:any = hourActiveDom.getAttribute("data-key");
                key = this.isNumeric(key) ? parseInt(key, 10): 0;
                hourDom.scroll({
                    top: cHeight * key
                });
            }
            if(minuteActiveDom && minuteDom.scrollTop < 10) {
                const cHeight = minuteActiveDom.clientHeight;
                let key:any = minuteActiveDom.getAttribute("data-key");
                key = this.isNumeric(key) ? parseInt(key, 10): 0;
                minuteDom.scroll({
                    top: cHeight * key
                });
            }
        }
    }
}
