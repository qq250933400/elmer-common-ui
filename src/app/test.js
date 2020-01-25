import { __extends, declareComponent,Component } from "elmer-ui-core";

var TestComponent = (function(_super){
    function Test(){
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __extends(Test, _super);
    _super.prototype.extend(Test.prototype, {
        state: {
            title: "test"
        },
        onClick: function(){
            this.setState({
                title: "refreshTitle" + (new Date()).getTime()
            });
            console.log(this.props);
        },
        $after: function(){
            console.log("after render component");
        },
        render: function() {
           // return "<div><button et:click='onClick'>测试</button><span>{{state.title}}</span></div>"
        }
    });
    return Test;
})(Component);

declareComponent({
    selector: "test",
    template: {
        url: "http://localhost:9000/assets/test.html"
    }
})(TestComponent);
// declareComponent({
//     selector: "test"
// })((function (_super) {
//     __extends(Test, _super);
//     function Test(props) {
//         return _super !== null && _super.apply(this, arguments) || this;
//     }
//     Test.prototype = {
//         state: {
//             title: "test"
//         },
//         render: function() {
//             return "<span>{{state.title}}</span>"
//         }
//     };
//     return Test;
// }(Component)));
