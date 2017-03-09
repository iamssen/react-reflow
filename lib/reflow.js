(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rxjs"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["rxjs", "react"], factory);
	else if(typeof exports === 'object')
		exports["Reflow"] = factory(require("rxjs"), require("react"));
	else
		root["Reflow"] = factory(root["Rx"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
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
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(4));
	__export(__webpack_require__(3));
	__export(__webpack_require__(6));
	__export(__webpack_require__(7));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var restrictedPropNames = ['children', 'parentStore'];
	exports.checkRestrictedPropNames = function (obj, errorMessage) {
	    var propName = restrictedPropNames.find(function (name) { return obj[name] !== undefined; });
	    if (typeof propName === 'string')
	        throw new Error(errorMessage(propName, restrictedPropNames));
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var rxjs_1 = __webpack_require__(1);
	var observe = function (permit) { return function () {
	    var names = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        names[_i] = arguments[_i];
	    }
	    return permit.observe.apply(permit, names);
	}; };
	var getState = function (permit) { return function () {
	    var names = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        names[_i] = arguments[_i];
	    }
	    return permit.getState.apply(permit, names);
	}; };
	var dispatch = function (permit) { return function (action) {
	    return permit.dispatch(action);
	}; };
	function isPromise(obj) {
	    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	}
	var StorePermit = (function () {
	    function StorePermit(store) {
	        var _this = this;
	        this.store = store;
	        this.hasParent = function () {
	            if (_this._destroyed) {
	                console.error('StorePermit이 파괴된 이후엔 StorePermit.hasParent()가 호출되면 안됨. 확인해서 지울것.');
	                return false;
	            }
	            if (_this.store && _this.store.destroyed) {
	                console.error('Store가 파괴된 이후엔 StorePermit.hasParent()가 호출되면 안됨. 확인해서 지울것.');
	                return false;
	            }
	            return _this.store
	                && !_this.store.destroyed
	                && _this.store.hasParent();
	        };
	        this.hasState = function (name) {
	            if (_this._destroyed) {
	                console.error('StorePermit이 파괴된 이후엔 StorePermit.hasState()가 호출되면 안됨. 확인해서 지울것.');
	                return false;
	            }
	            if (_this.store && _this.store.destroyed) {
	                console.error('Store가 파괴된 이후엔 StorePermit.hasState()가 호출되면 안됨. 확인해서 지울것.');
	                return false;
	            }
	            return _this.store
	                && !_this.store.destroyed
	                && _this.store.hasState(name);
	        };
	        this.isPlainState = function (name) {
	            if (_this._destroyed) {
	                console.error('StorePermit이 파괴된 이후엔 StorePermit.isPlainState()가 호출되면 안됨. 확인해서 지울것.');
	                return false;
	            }
	            if (_this.store && _this.store.destroyed) {
	                console.error('Store가 파괴된 이후엔 StorePermit.isPlainState()가 호출되면 안됨. 확인해서 지울것.');
	                return false;
	            }
	            return _this.store
	                && !_this.store.destroyed
	                && _this.store.isPlainState(name);
	        };
	        this.observe = function () {
	            var names = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                names[_i] = arguments[_i];
	            }
	            if (_this._destroyed) {
	                console.error('StorePermit이 파괴된 이후엔 StorePermit.observe()가 호출되면 안됨. 확인해서 지울것.');
	                return rxjs_1.Observable.empty();
	            }
	            if (_this.store && _this.store.destroyed) {
	                console.error('Store가 파괴된 이후엔 StorePermit.observe()가 호출되면 안됨. 확인해서 지울것.');
	                return rxjs_1.Observable.empty();
	            }
	            var subject = new rxjs_1.BehaviorSubject(null);
	            _this._subjects.push(subject);
	            _this._subscriptions.push((_a = _this.store).observe.apply(_a, names).subscribe(subject));
	            return subject.distinctUntilChanged().debounceTime(1, rxjs_1.Scheduler.queue);
	            var _a;
	        };
	        this.getState = function () {
	            var names = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                names[_i] = arguments[_i];
	            }
	            if (_this._destroyed) {
	                console.error('StorePermit이 파괴된 이후엔 StorePermit.getState()가 호출되면 안됨. 확인해서 지울것.');
	                return Promise.resolve({});
	            }
	            if (_this.store && _this.store.destroyed) {
	                console.error('Store가 파괴된 이후엔 StorePermit.getState()가 호출되면 안됨. 확인해서 지울것.');
	                return Promise.resolve({});
	            }
	            return (_a = _this.store).observe.apply(_a, names).first().toPromise();
	            var _a;
	        };
	        this.dispatch = function (action) {
	            if (_this._destroyed) {
	                console.error('StorePermit이 파괴된 이후엔 StorePermit.dispatch()가 호출되면 안됨. 확인해서 지울것.');
	                return;
	            }
	            if (_this.store && _this.store.destroyed) {
	                console.error('Store가 파괴된 이후엔 StorePermit.dispatch()가 호출되면 안됨. 확인해서 지울것.');
	                return;
	            }
	            if (typeof action === 'function') {
	                var broken_1 = false;
	                var teardown_1 = action(_this.tools);
	                return function () {
	                    if (!broken_1 && typeof teardown_1 === 'function')
	                        teardown_1();
	                    broken_1 = true;
	                };
	            }
	            else if (isPromise(action)) {
	                var broken_2 = false;
	                Promise.resolve(action).then(function (update) {
	                    if (broken_2 || _this.destroyed)
	                        return;
	                    Object.keys(update).forEach(function (name) {
	                        if (_this.store.isPlainState(name))
	                            _this.store.update(name, update[name]);
	                    });
	                });
	                return function () { return broken_2 = true; };
	            }
	            else {
	                var update_1 = action;
	                Object.keys(update_1).forEach(function (name) {
	                    if (_this.store.isPlainState(name))
	                        _this.store.update(name, update_1[name]);
	                });
	                return function () {
	                };
	            }
	        };
	        this.destroy = function () {
	            if (_this._destroyed) {
	                console.error('StorePermit.destroy() can not be executed multiple times. Find and delete redundant code.');
	                return;
	            }
	            for (var _i = 0, _a = _this._subjects; _i < _a.length; _i++) {
	                var subject = _a[_i];
	                subject.complete();
	                subject.unsubscribe();
	            }
	            for (var _b = 0, _c = _this._subscriptions; _b < _c.length; _b++) {
	                var subscription = _c[_b];
	                subscription.unsubscribe();
	            }
	            _this._subjects = null;
	            _this._subscriptions = null;
	            _this._destroyed = true;
	            _this.store = null;
	        };
	        this._destroyed = false;
	        this._subjects = [];
	        this._subscriptions = [];
	    }
	    Object.defineProperty(StorePermit.prototype, "destroyed", {
	        get: function () {
	            return this._destroyed
	                || !this.store
	                || this.store.destroyed;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StorePermit.prototype, "tools", {
	        get: function () {
	            var _this = this;
	            if (this._destroyed) {
	                console.error('StorePermit이 파괴된 이후엔 StorePermit.tools가 호출되면 안됨. 확인해서 지울것.');
	                return null;
	            }
	            if (this.store && this.store.destroyed) {
	                console.error('Store가 파괴된 이후엔 StorePermit.tools가 호출되면 안됨. 확인해서 지울것.');
	                return null;
	            }
	            var tools = {
	                observe: observe(this),
	                dispatch: dispatch(this),
	                getState: getState(this),
	            };
	            var storeTools = this.store.tools;
	            Object.keys(storeTools).forEach(function (name) {
	                tools[name] = storeTools[name](_this);
	            });
	            return tools;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return StorePermit;
	}());
	exports.StorePermit = StorePermit;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var rxjs_1 = __webpack_require__(1);
	var permit_1 = __webpack_require__(3);
	var checkRestrictPropNames_1 = __webpack_require__(2);
	function excludeDefaultTools(tools) {
	    var keys = Object.keys(tools);
	    if (keys.length === 0)
	        return {};
	    var defaultTools = ['dispatch', 'observe', 'getState'];
	    return keys
	        .filter(function (key) { return defaultTools.indexOf(key) === -1; })
	        .reduce(function (filtertedTools, key) {
	        filtertedTools[key] = tools[key];
	        return filtertedTools;
	    }, {});
	}
	var Store = (function () {
	    function Store(config, parentStore) {
	        var _this = this;
	        this.config = config;
	        this.parentStore = parentStore;
	        this.hasParent = function () {
	            if (_this._destroyed) {
	                console.error('Store 파괴 이후엔 hasParent()가 호출되면 안됨. 찾아서 삭제할 것.');
	                return false;
	            }
	            if (_this.parentStore) {
	                if (!_this.parentStore.destroyed) {
	                    return true;
	                }
	                else {
	                    console.error('The parent store has already been destroyed.\n' +
	                        'This hasParent() should not be executed.\n' +
	                        'Do not let this hasParent() execute.');
	                    return false;
	                }
	            }
	            else {
	                return false;
	            }
	        };
	        this.hasState = function (name) {
	            if (_this._destroyed) {
	                console.error('Store 파괴 이후엔 hasState()가 호출되면 안됨. 찾아서 삭제할 것.');
	                return false;
	            }
	            return _this.config.state[name] !== undefined
	                || (_this.parentStore && _this.parentStore.hasState(name));
	        };
	        this.isPlainState = function (name) {
	            if (_this._destroyed) {
	                console.error('Store 파괴 이후엔 isPlainState()가 호출되면 안됨. 찾아서 삭제할 것.');
	                return false;
	            }
	            if (!_this.hasState(name)) {
	                throw new Error("\"" + name + "\"\uC740 \uCC3E\uC744 \uC218 \uC5C6\uB294 state name\uC774\uB2E4.");
	            }
	            if (_this.config.state[name] !== undefined) {
	                return typeof _this.config.state[name] !== 'function';
	            }
	            else if (_this.parentStore) {
	                return _this.parentStore.isPlainState(name);
	            }
	        };
	        this.update = function (name, value) {
	            if (_this._destroyed) {
	                console.error('Store 파괴 이후에는 update()가 호출되면 안됨. 찾아서 삭제할 것.');
	                return;
	            }
	            if (!_this.hasState(name)) {
	                throw new Error("\"" + name + "\"\uC740 \uCC3E\uC744 \uC218 \uC5C6\uB294 state name\uC774\uB2E4.");
	            }
	            if (!_this.isPlainState(name)) {
	                throw new Error("\"" + name + "\"\uC740 Plain State\uAC00 \uC544\uB2C8\uAE30 \uB54C\uBB38\uC5D0 update \uD560 \uC218 \uC5C6\uB2E4.");
	            }
	            if (_this.config.state[name] !== undefined) {
	                var observable = _this.getObservable(name);
	                if (observable instanceof rxjs_1.Subject)
	                    observable.next(value);
	            }
	            else if (_this.parentStore) {
	                _this.parentStore.update(name, value);
	            }
	        };
	        this.getObservable = function (name) {
	            if (_this._destroyed) {
	                console.error('Store 파괴 이후 getObservable()이 호출되면 안됨. 찾아서 삭제할 것.');
	                return rxjs_1.Observable.empty();
	            }
	            if (!_this.hasState(name)) {
	                throw new Error("\"" + name + "\" is a state name that can not be found.");
	            }
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
	        };
	        this.observe = function () {
	            var names = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                names[_i] = arguments[_i];
	            }
	            if (_this._destroyed) {
	                console.error('Store 파괴 이후 observe()는 호출되면 안됨. 찾아서 삭제할 것.');
	                return rxjs_1.Observable.empty();
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
	        this.access = function () {
	            return !_this._destroyed ? new permit_1.StorePermit(_this) : null;
	        };
	        this.destroy = function () {
	            if (_this._destroyed) {
	                console.error('Store.destroy() can not be executed multiple times. Find and delete redundant code.');
	                return;
	            }
	            if (typeof _this._startupTeardown === 'function')
	                _this._startupTeardown();
	            if (_this._startupPermit instanceof permit_1.StorePermit)
	                _this._startupPermit.destroy();
	            _this._startupTeardown = null;
	            _this._startupPermit = null;
	            _this._observables.forEach(function (observable) {
	                if (observable instanceof rxjs_1.Subject) {
	                    observable.complete();
	                    observable.unsubscribe();
	                }
	            });
	            _this._observables.clear();
	            _this._destroyed = true;
	        };
	        checkRestrictPropNames_1.checkRestrictedPropNames(config.state, function (propName, restrictedPropNames) {
	            return "Do not inlcude " + propName + " to \"state\", Restricted prop names are [" + restrictedPropNames.join(', ') + "]";
	        });
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
	            if (this._destroyed) {
	                console.error('Store 파괴 이후엔 tools가 호출되면 안됨. 찾아서 삭제할 것.');
	                return null;
	            }
	            var tools = this.config && this.config.tools ? this.config.tools : {};
	            return this.parentStore
	                ? Object.assign({}, excludeDefaultTools(this.parentStore.tools), tools)
	                : tools || {};
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Store;
	}());
	exports.Store = Store;


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var react_1 = __webpack_require__(5);
	var store_1 = __webpack_require__(4);
	var checkRestrictPropNames_1 = __webpack_require__(2);
	function createContext(config) {
	    checkRestrictPropNames_1.checkRestrictedPropNames(config.state, function (propName, restrictedPropNames) {
	        return "Do not inlcude " + propName + " to \"state\", Restricted prop names are [" + restrictedPropNames.join(', ') + "]";
	    });
	    var isolated = config.isolate === true;
	    var toChildrenContextTypes = { '_REFLOW_CONTEXT_': react_1.PropTypes.object };
	    var fromParentContextTypes = {};
	    if (!isolated) {
	        toChildrenContextTypes['_REFLOW_PARENT_CONTEXT_'] = react_1.PropTypes.object;
	        fromParentContextTypes['_REFLOW_PARENT_CONTEXT_'] = react_1.PropTypes.object;
	    }
	    var Context = (function (_super) {
	        __extends(Context, _super);
	        function Context() {
	            var _this = _super !== null && _super.apply(this, arguments) || this;
	            _this.getContextProps = function () {
	                return _this.props;
	            };
	            // ---------------------------------------------
	            // StorePermit API
	            // ---------------------------------------------
	            _this.hasParent = function () {
	                return _this.permit.hasParent();
	            };
	            _this.hasState = function (name) {
	                return _this.permit.hasState(name);
	            };
	            _this.isPlainState = function (name) {
	                return _this.permit.isPlainState(name);
	            };
	            _this.observe = function () {
	                var names = [];
	                for (var _i = 0; _i < arguments.length; _i++) {
	                    names[_i] = arguments[_i];
	                }
	                return (_a = _this.permit).observe.apply(_a, names);
	                var _a;
	            };
	            _this.getState = function () {
	                var names = [];
	                for (var _i = 0; _i < arguments.length; _i++) {
	                    names[_i] = arguments[_i];
	                }
	                return (_a = _this.permit).getState.apply(_a, names);
	                var _a;
	            };
	            _this.dispatch = function (action) {
	                return _this.permit.dispatch(action);
	            };
	            return _this;
	        }
	        Context.prototype.getChildContext = function () {
	            var context = { '_REFLOW_CONTEXT_': this.store };
	            if (!isolated)
	                context['_REFLOW_PARENT_CONTEXT_'] = this.store;
	            return context;
	        };
	        ;
	        Context.prototype.render = function () {
	            // FIXME Allow multiple children elements. However, multiple children are warapped in <div>
	            return react_1.Children.count(this.props.children) > 1
	                ? react_1.createElement('div', null, this.props.children)
	                : this.props.children;
	        };
	        Context.prototype.receiveProps = function (prevProps, nextProps) {
	            var _this = this;
	            Object.keys(nextProps).forEach(function (name) {
	                if (typeof _this.contextProps[name] === 'function' && prevProps[name] !== nextProps[name]) {
	                    _this.contextProps[name](prevProps[name], nextProps[name]);
	                }
	            });
	        };
	        Context.prototype.componentWillMount = function () {
	            // FIXME props를 통해서 parentStore 수동 입력 (다른 frame과 혼합시에 도움이 될듯 싶다)
	            this.store = new store_1.Store(config, this.props.parentStore || this.context._REFLOW_PARENT_CONTEXT_);
	            this.permit = this.store.access();
	            if (typeof config.handleContextProps === 'function') {
	                this.unhandleContextProps = config.handleContextProps(this.permit.tools, this.getContextProps);
	            }
	            if (typeof config.receiveContextProps === 'function') {
	                this.contextProps = config.receiveContextProps(this.permit.tools);
	                checkRestrictPropNames_1.checkRestrictedPropNames(this.contextProps, function (propName, restrictedPropNames) {
	                    return "Do not inlcude " + propName + " to \"receiveContextProps\", Restricted prop names are [" + restrictedPropNames.join(', ') + "]";
	                });
	                this.receiveProps({}, this.props);
	            }
	        };
	        Context.prototype.componentWillReceiveProps = function (nextProps) {
	            if (this.contextProps) {
	                this.receiveProps(this.props, nextProps);
	            }
	        };
	        Context.prototype.componentWillUnmount = function () {
	            if (typeof this.unhandleContextProps === 'function')
	                this.unhandleContextProps();
	            this.unhandleContextProps = null;
	            this.permit.destroy();
	            this.store.destroy();
	            this.permit = null;
	            this.store = null;
	        };
	        Context.prototype.shouldComponentUpdate = function (nextProps) {
	            return this.props.children !== nextProps.children;
	        };
	        return Context;
	    }(react_1.Component));
	    Context.displayName = "Context({" + Object.keys(config.state).join(',') + "})";
	    // to children components
	    Context.childContextTypes = toChildrenContextTypes;
	    Context.contextTypes = fromParentContextTypes;
	    return Context;
	}
	exports.createContext = createContext;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var rxjs_1 = __webpack_require__(1);
	var react_1 = __webpack_require__(5);
	function provide() {
	    var providers = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        providers[_i] = arguments[_i];
	    }
	    // TODO Support deprecated provide api. This is going to remove in 0.6
	    if (typeof providers[0] === 'function' || typeof providers[1] === 'function') {
	        var legacyProvider = {};
	        if (typeof providers[0] === 'function')
	            legacyProvider.mapState = providers[0];
	        if (typeof providers[1] === 'function')
	            legacyProvider.mapHandlers = providers[1];
	        providers = [legacyProvider];
	    }
	    return function (WrappedComponent) {
	        var Provided = (function (_super) {
	            __extends(Provided, _super);
	            function Provided() {
	                var _this = _super !== null && _super.apply(this, arguments) || this;
	                _this.state = {
	                    drops: null,
	                };
	                return _this;
	            }
	            Provided.prototype.render = function () {
	                return this.state.drops && this.dropState
	                    ? react_1.createElement(WrappedComponent, this.state.drops)
	                    : null;
	            };
	            Provided.prototype.updateDrops = function (props) {
	                this.setState({
	                    drops: Object.assign({}, props, this.dropState, this.dropHandlers)
	                });
	            };
	            Provided.prototype.componentWillMount = function () {
	                var _this = this;
	                this.permit = this.context._REFLOW_CONTEXT_.access();
	                var mapState = providers
	                    .filter(function (provider) { return typeof provider.mapState === 'function'; })
	                    .map(function (provider) { return provider.mapState(_this.permit.observe); });
	                var mapHandler = providers
	                    .filter(function (provider) { return typeof provider.mapHandlers === 'function'; })
	                    .map(function (provider) { return provider.mapHandlers(_this.permit.tools); });
	                this.dropHandlers = Object.assign.apply(Object, [{}].concat(mapHandler));
	                if (mapState.length > 0) {
	                    this.subscription = rxjs_1.Observable.combineLatest.apply(rxjs_1.Observable, mapState).map(function (states) { return Object.assign.apply(Object, [{}].concat(states)); })
	                        .subscribe(function (state) {
	                        _this.dropState = state;
	                        _this.updateDrops(_this.props);
	                    });
	                }
	                else {
	                    this.dropState = {};
	                    this.updateDrops(this.props);
	                }
	            };
	            Provided.prototype.componentWillReceiveProps = function (nextProps) {
	                this.updateDrops(nextProps);
	            };
	            Provided.prototype.componentWillUnmount = function () {
	                if (this.subscription)
	                    this.subscription.unsubscribe();
	                this.permit.destroy();
	                this.subscription = null;
	                this.permit = null;
	                this.dropHandlers = null;
	                this.dropState = null;
	            };
	            Provided.prototype.shouldComponentUpdate = function (nextProps, nextState) {
	                return this.state.drops !== nextState.drops;
	            };
	            return Provided;
	        }(react_1.Component));
	        Provided.displayName = "Provided(" + (WrappedComponent.displayName || WrappedComponent.name) + ")";
	        Provided.contextTypes = {
	            _REFLOW_CONTEXT_: react_1.PropTypes.object,
	        };
	        return Provided;
	    };
	}
	exports.provide = provide;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=reflow.js.map