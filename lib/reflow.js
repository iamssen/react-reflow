(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["Reflow"] = factory(require("React"));
	else
		root["Reflow"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.createContext = createContext;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Context = function () {
	  function Context() {
	    _classCallCheck(this, Context);
	  }

	  _createClass(Context, [{
	    key: 'install',

	    /** @return {Context} */
	    value: function install(module, map) {
	      var m = typeof map === 'function' ? map(module) : module;
	      if (m.backgrounds) this.backgrounds.apply(this, _toConsumableArray(m.backgrounds));
	      if (m.reducers) this.reducers(m.reducers);
	      if (m.constants) this.constants(m.constants);
	      return this;
	    }

	    /** @return {Context} */

	  }, {
	    key: 'reducers',
	    value: function reducers(_reducers) {
	      var keys = Object.keys(_reducers);
	      if (keys.length === 0) return this;
	      keys.forEach(function (k) {
	        if (typeof _reducers[k] !== 'function') {
	          throw new Error(k + ' is not a function. reducer should be a function');
	        }
	      });
	      this._reducers = Object.assign(this._reducers || {}, _reducers);
	      return this;
	    }

	    /** @return {Context} */

	  }, {
	    key: 'backgrounds',
	    value: function backgrounds() {
	      var _this = this;

	      for (var _len = arguments.length, _backgrounds = Array(_len), _key = 0; _key < _len; _key++) {
	        _backgrounds[_key] = arguments[_key];
	      }

	      if (_backgrounds.length === 0) return this;
	      if (!this._backgrounds) this._backgrounds = new Set();
	      _backgrounds.filter(function (bg) {
	        return !_this._backgrounds.has(bg);
	      }).forEach(function (bg) {
	        return _this._backgrounds.add(bg);
	      });
	      return this;
	    }
	  }, {
	    key: 'constants',
	    value: function constants(_constants) {
	      var keys = Object.keys(_constants);
	      if (keys.length === 0) return this;
	      this._constants = Object.assign(this._constants || {}, _constants);
	      return this;
	    }

	    /** @return React Component */

	  }, {
	    key: 'toComponent',
	    value: function toComponent() {
	      var contextTypes = {
	        __REFLOW_PARENT_CONTEXT__: _react2.default.PropTypes.object
	      };

	      var childContextTypes = {
	        __REFLOW_PARENT_CONTEXT__: _react2.default.PropTypes.object,
	        enterParent: _react2.default.PropTypes.func,
	        dispatch: _react2.default.PropTypes.func
	      };

	      var initialState = {};

	      /** @type {string[]} */
	      var reducers = this._reducers || {};
	      var reducerKeys = Object.keys(reducers);
	      if (reducerKeys.length > 0) reducerKeys.forEach(function (k) {
	        return childContextTypes[k] = _react2.default.PropTypes.any;
	      });

	      /** @type {Function[]} */
	      var backgrounds = this._backgrounds && this._backgrounds.size > 0 ? Array.from(this._backgrounds) : [];

	      /** @type {any[]} */
	      var constants = this._constants || {};
	      var constantKeys = Object.keys(constants);
	      if (constantKeys.length > 0) constantKeys.forEach(function (k) {
	        childContextTypes[k] = _react2.default.PropTypes.any;
	        initialState[k] = constants[k];
	      });

	      // create context component class

	      var Component = function (_React$Component) {
	        _inherits(Component, _React$Component);

	        function Component() {
	          var _ref;

	          var _temp, _this2, _ret;

	          _classCallCheck(this, Component);

	          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	          }

	          return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = Component.__proto__ || Object.getPrototypeOf(Component)).call.apply(_ref, [this].concat(args))), _this2), _this2.state = initialState, _this2.dispatch = function (action) {
	            Promise.resolve(action).then(function (action) {
	              if ((0, _lodash2.default)(action)) {
	                (function () {
	                  var context = {};
	                  var changed = false;

	                  reducerKeys.forEach(function (k) {
	                    var current = _this2.store[k];
	                    var next = reducers[k](current, action);
	                    if (current !== next) {
	                      _this2.store[k] = next;
	                      context[k] = next;
	                      changed = true;
	                    }
	                  });

	                  if (changed) _this2.setState(context);
	                })();
	              } else if (typeof action === 'function') {
	                _this2.dispatch(action(_this2._getReflowContext()));
	              }
	            });
	          }, _this2.enterParent = function (fn) {
	            fn(_this2._getReflowContext());
	          }, _this2._getReflowContext = function () {
	            if (_this2.context.__REFLOW_PARENT_CONTEXT__) {
	              return Object.assign({}, _this2.context.__REFLOW_PARENT_CONTEXT__._getReflowContext(), _this2.getChildContext());
	            }
	            return _this2.getChildContext();
	          }, _temp), _possibleConstructorReturn(_this2, _ret);
	        }

	        _createClass(Component, [{
	          key: 'getChildContext',
	          value: function getChildContext() {
	            var _this3 = this;

	            var context = {
	              __REFLOW_PARENT_CONTEXT__: this,
	              enterParent: this.context && this.context.__REFLOW_PARENT_CONTEXT__ && this.context.__REFLOW_PARENT_CONTEXT__.enterParent,
	              dispatch: this.dispatch
	            };
	            reducerKeys.forEach(function (k) {
	              return context[k] = _this3.state[k];
	            });
	            constantKeys.forEach(function (k) {
	              return context[k] = _this3.state[k];
	            });
	            return context;
	          }
	        }, {
	          key: 'render',
	          value: function render() {
	            return this.props.children;
	          }
	        }, {
	          key: 'componentWillMount',
	          value: function componentWillMount() {
	            if (this.props.initialStates) {
	              this.store = this.props.initialStates;
	              this.setState(this.props.initialStates);
	            } else {
	              this.store = {};
	            }
	            this.dispatch({ type: '__REFLOW_INIT__' });
	          }
	        }, {
	          key: 'componentDidMount',
	          value: function componentDidMount() {
	            var _this4 = this;

	            this.unsubscribes = backgrounds.map(function (bg) {
	              return bg(_this4._getReflowContext());
	            });
	          }
	        }, {
	          key: 'componentWillUnmount',
	          value: function componentWillUnmount() {
	            this.unsubscribes.forEach(function (unsubscribe) {
	              return unsubscribe();
	            });
	          }
	        }]);

	        return Component;
	      }(_react2.default.Component);

	      Component.contextTypes = contextTypes;
	      Component.childContextTypes = childContextTypes;
	      Component.propTypes = {
	        initialStates: _react2.default.PropTypes.object
	      };


	      return Component;
	    }
	  }]);

	  return Context;
	}();

	/** @return {Context} */


	function createContext() {
	  return new Context();
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}

	module.exports = isPlainObject;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;