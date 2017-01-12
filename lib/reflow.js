(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("rxjs"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "rxjs"], factory);
	else if(typeof exports === 'object')
		exports["Reflow"] = factory(require("react"), require("rxjs"));
	else
		root["Reflow"] = factory(root["React"], root["Rx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(1));
	__export(__webpack_require__(4));
	__export(__webpack_require__(3));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var rxjs_1 = __webpack_require__(5);
	// ---------------------------------------------
	// Tools
	// ---------------------------------------------
	var observe = function (permit) { return function () {
	    var names = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        names[_i] = arguments[_i];
	    }
	    return permit.observe.apply(permit, names);
	}; };
	var dispatch = function (permit) { return function (action) {
	    return permit.dispatch(action);
	}; };
	// ---------------------------------------------
	// StorePermit
	// ---------------------------------------------
	var StorePermit = (function () {
	    function StorePermit(store) {
	        var _this = this;
	        this.store = store;
	        this.observe = function () {
	            var names = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                names[_i] = arguments[_i];
	            }
	            if (_this._destroyed || _this.store.destroyed)
	                return rxjs_1.Observable.empty();
	            var subject = new rxjs_1.BehaviorSubject({});
	            _this._subjects.push(subject);
	            _this._subscriptions.push((_a = _this.store).observe.apply(_a, names).subscribe(subject));
	            return subject.debounceTime(1, rxjs_1.Scheduler.queue);
	            var _a;
	        };
	        this.dispatch = function (action) {
	            if (typeof action === 'function') {
	                var broken_1 = false;
	                var teardown_1 = action(_this.tools);
	                return function () {
	                    if (!broken_1 && typeof teardown_1 === 'function')
	                        teardown_1();
	                    broken_1 = true;
	                };
	            }
	            else {
	                var broken_2 = false;
	                Promise.resolve(action).then(function (update) {
	                    if (broken_2)
	                        return;
	                    Object.keys(update).forEach(function (name) {
	                        if (_this.store.isPlainState(name))
	                            _this.store.update(name, update[name]);
	                    });
	                });
	                return function () { return broken_2 = true; };
	            }
	        };
	        this._destroyed = false;
	        this._subjects = [];
	        this._subscriptions = [];
	    }
	    Object.defineProperty(StorePermit.prototype, "tools", {
	        get: function () {
	            var _this = this;
	            var tools = {
	                observe: observe(this),
	                dispatch: dispatch(this),
	            };
	            var additionalTools = this.store.tools;
	            Object.keys(additionalTools).forEach(function (name) {
	                tools[name] = additionalTools[name](_this);
	            });
	            return tools;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    StorePermit.prototype.destroy = function () {
	        for (var _i = 0, _a = this._subjects; _i < _a.length; _i++) {
	            var subject = _a[_i];
	            subject.complete();
	            subject.unsubscribe();
	        }
	        for (var _b = 0, _c = this._subscriptions; _b < _c.length; _b++) {
	            var subscription = _c[_b];
	            subscription.unsubscribe();
	        }
	        this._subjects = null;
	        this._subscriptions = null;
	        this._destroyed = true;
	    };
	    return StorePermit;
	}());
	exports.StorePermit = StorePermit;
	// ---------------------------------------------
	// Store
	// ---------------------------------------------
	var Store = (function () {
	    function Store(config, parentStore) {
	        var _this = this;
	        this.config = config;
	        this.parentStore = parentStore;
	        this.isPlainState = function (name) {
	            return typeof _this.config.state[name] !== 'function';
	        };
	        this.update = function (name, value) {
	            if (_this._observables.has(name)) {
	                var observable = _this._observables.get(name);
	                if (observable instanceof rxjs_1.Subject)
	                    observable.next(value);
	            }
	            else if (_this.parentStore) {
	                _this.parentStore.update(name, value);
	            }
	        };
	        this.getObservable = function (name) {
	            if (_this.config.state[name] !== undefined) {
	                if (!_this._observables.has(name)) {
	                    var observable = _this.isPlainState(name)
	                        ? new rxjs_1.BehaviorSubject(_this.config.state[name])
	                        : _this.config.state[name](_this.observe);
	                    _this._observables.set(name, observable);
	                }
	                return _this._observables.get(name);
	            }
	            else if (_this.parentStore) {
	                return _this.parentStore.getObservable(name);
	            }
	            else {
	                return undefined;
	            }
	        };
	        this.observe = function () {
	            var names = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                names[_i] = arguments[_i];
	            }
	            if (names.length === 1) {
	                return _this.getObservable(names[0])
	                    .map(function (value) {
	                    var states = {};
	                    states[names[0]] = value;
	                    return states;
	                });
	            }
	            else if (names.length > 1) {
	                return rxjs_1.Observable
	                    .combineLatest.apply(rxjs_1.Observable, names.map(function (name) { return _this.getObservable(name); }).concat([function () {
	                        var values = [];
	                        for (var _i = 0; _i < arguments.length; _i++) {
	                            values[_i] = arguments[_i];
	                        }
	                        return values.reduce(function (states, value, i) {
	                            states[names[i]] = value;
	                            return states;
	                        }, {});
	                    }]));
	            }
	            else {
	                throw new Error('names length is 0');
	            }
	        };
	        this._observables = new Map();
	        this._destroyed = false;
	        if (typeof config.startup === 'function') {
	            this._startupPermit = this.access();
	            this._startupTeardown = this._startupPermit.dispatch(this.config.startup);
	        }
	    }
	    Object.defineProperty(Store.prototype, "destroyed", {
	        get: function () {
	            return this._destroyed;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Store.prototype, "tools", {
	        get: function () {
	            return this.parentStore
	                ? Object.assign({}, this.parentStore.tools, this.config.tools)
	                : this.config.tools || {};
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Store.prototype.access = function () {
	        return new StorePermit(this);
	    };
	    Store.prototype.destroy = function () {
	        if (typeof this._startupTeardown === 'function')
	            this._startupTeardown();
	        if (this._startupPermit instanceof StorePermit)
	            this._startupPermit.destroy();
	        this._startupTeardown = null;
	        this._startupPermit = null;
	        this._observables.forEach(function (observable) {
	            if (observable instanceof rxjs_1.Subject) {
	                observable.complete();
	                observable.unsubscribe();
	            }
	        });
	        this._observables.clear();
	        this._destroyed = true;
	    };
	    return Store;
	}());
	exports.Store = Store;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var react_1 = __webpack_require__(2);
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var react_1 = __webpack_require__(2);
	var store_1 = __webpack_require__(1);
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }
/******/ ])
});
;