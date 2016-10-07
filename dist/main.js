webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(132);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(163);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactReflow = __webpack_require__(350);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var rand = function rand() {
	  return Math.floor(Math.random() * 1000);
	};

	// ---------------------------------------------
	// actions
	// ---------------------------------------------
	var UPDATE_X = 'UPDATE_X';
	var UPDATE_Y = 'UPDATE_Y';

	var plainAction = function plainAction() {
	  return {
	    type: UPDATE_X,
	    x: 'Plain Action - ' + rand()
	  };
	};

	var promiseAction = function promiseAction() {
	  return new Promise(function (resolve) {
	    setTimeout(function () {
	      resolve({
	        type: UPDATE_X,
	        x: 'Promise Action - ' + rand()
	      });
	    }, 1000);
	  });
	};

	var thunkAction = function thunkAction() {
	  return function (_ref) {
	    var dispatch = _ref.dispatch;

	    setTimeout(function () {
	      dispatch({
	        type: UPDATE_X,
	        x: 'Thunk Action - ' + rand()
	      });
	    }, 1000);
	  };
	};

	var toParentAction = function toParentAction() {
	  return function (_ref2) {
	    var enterParent = _ref2.enterParent;

	    enterParent(function (_ref3) {
	      var dispatch = _ref3.dispatch;

	      dispatch({
	        type: UPDATE_X,
	        x: 'To Parent from Child - ' + rand()
	      });
	    });
	  };
	};

	// ---------------------------------------------
	// reducers
	// ---------------------------------------------
	var x = function x() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'none';
	  var action = arguments[1];

	  if (action.type === UPDATE_X) return action.x;
	  return state;
	};

	var y = function y() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'none';
	  var action = arguments[1];

	  if (action.type === UPDATE_Y) return action.y;
	  return state;
	};

	// ---------------------------------------------
	// backgrounds
	// ---------------------------------------------
	var backgroundService = function backgroundService(_ref4) {
	  var dispatch = _ref4.dispatch;

	  var intervalId = setInterval(function () {
	    console.log('Background Service - ' + Date.now());
	  }, 500);
	  return function () {
	    clearInterval(intervalId);
	  };
	};

	// ---------------------------------------------
	// contexts
	// ---------------------------------------------
	var TopContext = (0, _reactReflow.createContext)().reducers({ x: x })
	// .backgrounds(backgroundService)
	.toComponent();

	var GroupContext = (0, _reactReflow.createContext)().reducers({ y: y }).toComponent();

	// ---------------------------------------------
	// components
	// ---------------------------------------------

	var A = function (_React$Component) {
	  _inherits(A, _React$Component);

	  function A() {
	    var _ref5;

	    var _temp, _this, _ret;

	    _classCallCheck(this, A);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref5 = A.__proto__ || Object.getPrototypeOf(A)).call.apply(_ref5, [this].concat(args))), _this), _this.dispatchPlain = function () {
	      _this.context.dispatch(plainAction());
	    }, _this.dispatchPromise = function () {
	      _this.context.dispatch(promiseAction());
	    }, _this.dispatchThunk = function () {
	      _this.context.dispatch(thunkAction());
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  _createClass(A, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { style: { border: '1px solid black', padding: '15px' } },
	        _react2.default.createElement(
	          'h1',
	          null,
	          this.context.x
	        ),
	        _react2.default.createElement(
	          'button',
	          { onClick: this.dispatchPlain },
	          'Dispatch Plain Action'
	        ),
	        _react2.default.createElement(
	          'button',
	          { onClick: this.dispatchPromise },
	          'Dispatch Promise Action'
	        ),
	        _react2.default.createElement(
	          'button',
	          { onClick: this.dispatchThunk },
	          'Dispatch Thunk Action'
	        ),
	        this.props.children
	      );
	    }
	  }]);

	  return A;
	}(_react2.default.Component);

	A.contextTypes = {
	  x: _react2.default.PropTypes.string,
	  dispatch: _react2.default.PropTypes.func
	};

	var B = function (_React$Component2) {
	  _inherits(B, _React$Component2);

	  function B() {
	    var _ref6;

	    var _temp2, _this2, _ret2;

	    _classCallCheck(this, B);

	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref6 = B.__proto__ || Object.getPrototypeOf(B)).call.apply(_ref6, [this].concat(args))), _this2), _this2.dispatch = function () {
	      _this2.context.dispatch({
	        type: UPDATE_Y,
	        y: 'Internal Value - ' + rand()
	      });
	    }, _this2.toParentWithEnterParent = function () {
	      _this2.context.enterParent(function (_ref7) {
	        var dispatch = _ref7.dispatch;

	        dispatch({
	          type: UPDATE_X,
	          x: 'From Child - ' + rand()
	        });
	      });
	    }, _this2.toParentAction = function () {
	      _this2.context.dispatch(toParentAction());
	    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
	  }

	  _createClass(B, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { style: { border: '1px solid black', padding: '15px', marginTop: '10px' } },
	        _react2.default.createElement(
	          'h1',
	          null,
	          this.context.x,
	          ' : ',
	          this.context.y
	        ),
	        _react2.default.createElement(
	          'button',
	          { onClick: this.toParentWithEnterParent },
	          'To Parent With enterParent()'
	        ),
	        _react2.default.createElement(
	          'button',
	          { onClick: this.toParentAction },
	          'To Parent Action'
	        ),
	        _react2.default.createElement(
	          'button',
	          { onClick: this.dispatch },
	          'Dispatch Internal'
	        )
	      );
	    }
	  }]);

	  return B;
	}(_react2.default.Component);

	// ---------------------------------------------
	// render
	// ---------------------------------------------


	B.contextTypes = {
	  x: _react2.default.PropTypes.string,
	  y: _react2.default.PropTypes.string,
	  dispatch: _react2.default.PropTypes.func,
	  enterParent: _react2.default.PropTypes.func
	};
	_reactDom2.default.render(_react2.default.createElement(
	  TopContext,
	  { initialStates: { x: 'Initial Value...' } },
	  _react2.default.createElement(
	    A,
	    null,
	    _react2.default.createElement(
	      GroupContext,
	      null,
	      _react2.default.createElement(B, null)
	    ),
	    _react2.default.createElement(
	      GroupContext,
	      null,
	      _react2.default.createElement(B, null)
	    ),
	    _react2.default.createElement(
	      GroupContext,
	      null,
	      _react2.default.createElement(B, null)
	    ),
	    _react2.default.createElement(
	      GroupContext,
	      null,
	      _react2.default.createElement(B, null)
	    )
	  )
		), document.querySelector('#app'));

/***/ },

/***/ 349:
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

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.createContext = createContext;

	var _react = __webpack_require__(132);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(349);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Context = function () {
	  function Context() {
	    _classCallCheck(this, Context);
	  }

	  _createClass(Context, [{
	    key: 'reducers',
	    value: function reducers(_reducers) {
	      this._reducers = Object.assign(this._reducers || {}, _reducers);
	      return this;
	    }
	  }, {
	    key: 'backgrounds',
	    value: function backgrounds() {
	      var _this = this;

	      if (!this.bg) this.bg = new Set();

	      for (var _len = arguments.length, _backgrounds = Array(_len), _key = 0; _key < _len; _key++) {
	        _backgrounds[_key] = arguments[_key];
	      }

	      _backgrounds.filter(function (bg) {
	        return !_this.bg.has(bg);
	      }).forEach(function (bg) {
	        return _this.bg.add(bg);
	      });
	      return this;
	    }
	  }, {
	    key: 'toComponent',
	    value: function toComponent() {
	      var contextTypes = {
	        __REFLOW_ENTER_PARENT__: _react2.default.PropTypes.func
	      };

	      var childContextTypes = {
	        __REFLOW_ENTER_PARENT__: _react2.default.PropTypes.func,
	        enterParent: _react2.default.PropTypes.func,
	        dispatch: _react2.default.PropTypes.func
	      };

	      var reducers = this._reducers;
	      var reducerNames = reducers ? Object.keys(reducers) : [];
	      reducerNames.forEach(function (name) {
	        return childContextTypes[name] = _react2.default.PropTypes.any;
	      });

	      var backgrounds = this.bg ? Array.from(this.bg) : [];

	      var Component = function (_React$Component) {
	        _inherits(Component, _React$Component);

	        function Component() {
	          var _ref;

	          var _temp, _this2, _ret;

	          _classCallCheck(this, Component);

	          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	          }

	          return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = Component.__proto__ || Object.getPrototypeOf(Component)).call.apply(_ref, [this].concat(args))), _this2), _this2.state = {}, _this2.dispatch = function (action) {
	            Promise.resolve(action).then(function (action) {
	              if ((0, _lodash2.default)(action)) {
	                (function () {
	                  var state = {};
	                  var changed = false;

	                  reducerNames.forEach(function (name) {
	                    var current = _this2.store[name];
	                    var next = reducers[name](current, action);
	                    if (current !== next) {
	                      _this2.store[name] = next;
	                      state[name] = next;
	                      changed = true;
	                    }
	                  });

	                  if (changed) _this2.setState(state);
	                })();
	              } else if (typeof action === 'function') {
	                _this2.dispatch(action(_this2.getChildContext()));
	              }
	            });
	          }, _this2.enterParent = function (fn) {
	            fn(_this2.getChildContext());
	          }, _temp), _possibleConstructorReturn(_this2, _ret);
	        } // from parent
	        // to children

	        _createClass(Component, [{
	          key: 'getChildContext',
	          value: function getChildContext() {
	            var _this3 = this;

	            var context = {
	              __REFLOW_ENTER_PARENT__: this.enterParent,
	              enterParent: this.context.__REFLOW_ENTER_PARENT__,
	              dispatch: this.dispatch
	            };

	            reducerNames.forEach(function (r) {
	              return context[r] = _this3.state[r];
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
	            var context = this.getChildContext();
	            this.unsubscribes = backgrounds.map(function (bg) {
	              return bg(context);
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

	function createContext() {
	  return new Context();
	}

/***/ }

});
//# sourceMappingURL=main.map