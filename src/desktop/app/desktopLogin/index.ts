import { Component, declareComponent, ElmerServiceRequest, IPropCheckRule, PropTypes } from "elmer-ui-core";

@declareComponent({
    selector: "desktopLogin",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export class DesktopLogin extends Component {
    // tslint:disable-next-line: promise-function-async
    onAfterLogin(resp:any): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({});
            }, 3200);
        });
    }
}
