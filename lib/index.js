'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createContext = createContext;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.isplainobject');

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

    /** @return {Context} */
    value: function reducers(_reducers) {
      this._reducers = Object.assign(this._reducers || {}, _reducers);
      return this;
    }

    /** @return {Context} */

  }, {
    key: 'backgrounds',
    value: function backgrounds() {
      var _this = this;

      if (!this._backgrounds) this._backgrounds = new Set();

      for (var _len = arguments.length, _backgrounds = Array(_len), _key = 0; _key < _len; _key++) {
        _backgrounds[_key] = arguments[_key];
      }

      _backgrounds.filter(function (bg) {
        return !_this._backgrounds.has(bg);
      }).forEach(function (bg) {
        return _this._backgrounds.add(bg);
      });
      return this;
    }

    /** @return {React.Component} */

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

      var backgrounds = this._backgrounds ? Array.from(this._backgrounds) : [];

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


        _createClass(Component, [{
          key: 'getChildContext',
          // to children

          value: function getChildContext() {
            var _this3 = this;

            var context = {
              __REFLOW_ENTER_PARENT__: this.enterParent,
              enterParent: this.context.__REFLOW_ENTER_PARENT__,
              dispatch: this.dispatch
            };

            reducerNames.forEach(function (name) {
              return context[name] = _this3.state[name];
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
              return bg(_this4.getChildContext());
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