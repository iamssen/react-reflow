"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
var store_1 = require("./store");
var blockNames = ['children', 'parentStore'];
function createContext(config) {
    blockNames.forEach(function (name) {
        if (config.state[name] !== undefined) {
            throw new Error("Do not include \"" + name + "\" to \"state\"");
        }
    });
    var Context = (function (_super) {
        __extends(Context, _super);
        function Context() {
            var _this = _super.apply(this, arguments) || this;
            _this.observe = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                return (_a = _this.permit).observe.apply(_a, names);
                var _a;
            };
            _this.dispatch = function (action) {
                return _this.permit.dispatch(action);
            };
            return _this;
        }
        Context.prototype.getChildContext = function () {
            return {
                parentStore: this.store,
            };
        };
        ;
        Context.prototype.render = function () {
            return this.props.children;
        };
        Context.prototype.propsToUpdate = function (prevProps, nextProps) {
            var update = {};
            var hasUpdate = false;
            for (var _i = 0, nextProps_1 = nextProps; _i < nextProps_1.length; _i++) {
                var _a = nextProps_1[_i], name_1 = _a[0], value = _a[1];
                if (this.store.isPlainState(name_1) && prevProps[name_1] !== nextProps[name_1]) {
                    update[name_1] = value;
                    hasUpdate = true;
                }
            }
            return hasUpdate ? update : null;
        };
        Context.prototype.componentWillMount = function () {
            // FIXME props를 통해서 parentStore 수동 입력 (다른 frame과 혼합시에 도움이 될듯 싶다)
            this.store = new store_1.Store(config, this.context.parentStore || this.props.parentStore);
            this.permit = this.store.access();
            var update = this.propsToUpdate({}, this.props);
            if (update)
                this.permit.dispatch(update);
        };
        Context.prototype.componentWillReceiveProps = function (nextProps) {
            var update = this.propsToUpdate(this.props, nextProps);
            if (update)
                this.permit.dispatch(update);
        };
        Context.prototype.componentWillUnmount = function () {
            this.permit.destroy();
            this.store.destroy();
            this.permit = null;
            this.store = null;
        };
        return Context;
    }(react_1.Component));
    // to children components
    Context.childContextTypes = {
        parentStore: react_1.PropTypes.object,
    };
    Context.contextTypes = {
        parentStore: react_1.PropTypes.object,
    };
    return Context;
}
exports.createContext = createContext;
//# sourceMappingURL=createContext.js.map