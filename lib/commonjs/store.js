"use strict";
var rxjs_1 = require("rxjs");
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
//# sourceMappingURL=store.js.map