"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
function connect(operator) {
    var Connector = (function (_super) {
        __extends(Connector, _super);
        function Connector() {
            var _this = _super.apply(this, arguments) || this;
            _this.state = {
                drops: {},
            };
            return _this;
        }
        Connector.prototype.render = function () {
            return react_1.cloneElement(this.props.children, this.state.drops);
        };
        Connector.prototype.componentWillMount = function () {
            var _this = this;
            this.permit = this.context.parentStore.access();
            if (typeof operator === 'function') {
                this.subscription = operator(this.permit.observe).subscribe(function (state) {
                    _this.setState({
                        drops: Object.assign({ dispatch: _this.permit.dispatch }, _this.state.drops, state),
                    });
                });
            }
            else {
                this.setState({
                    drops: { dispatch: this.permit.dispatch },
                });
            }
        };
        Connector.prototype.componentWillUnmount = function () {
            if (this.subscription)
                this.subscription.unsubscribe();
            this.permit.destroy();
            this.subscription = null;
            this.permit = null;
        };
        return Connector;
    }(react_1.Component));
    Connector.contextTypes = {
        parentStore: react_1.PropTypes.object,
    };
    return Connector;
}
exports.connect = connect;
//# sourceMappingURL=connect.js.map