import React from 'react';
import isPlainObject from 'lodash.isplainobject';

class Context {
  /** @return {Context} */
  install(module, map) {
    const m = (typeof map === 'function') ? map(module) : module;
    if (m.backgrounds) this.backgrounds(...m.backgrounds);
    if (m.reducers) this.reducers(m.reducers);
    if (m.constants) this.constants(m.constants);
    return this;
  }
  
  /** @return {Context} */
  reducers(reducers) {
    const keys = Object.keys(reducers);
    if (keys.length === 0) return this;
    keys.forEach(k => {
      if (typeof reducers[k] !== 'function') {
        throw new Error(`${k} is not a function. reducer should be a function`);
      }
    });
    this._reducers = Object.assign(this._reducers || {}, reducers);
    return this;
  }
  
  /** @return {Context} */
  backgrounds(...backgrounds) {
    if (backgrounds.length === 0) return this;
    if (!this._backgrounds) this._backgrounds = new Set;
    backgrounds.filter(bg => !this._backgrounds.has(bg)).forEach(bg => this._backgrounds.add(bg));
    return this;
  }
  
  constants(constants) {
    const keys = Object.keys(constants);
    if (keys.length === 0) return this;
    this._constants = Object.assign(this._constants || {}, constants);
    return this;
  }
  
  /** @return React Component */
  toComponent() {
    const contextTypes = {
      __REFLOW_PARENT_CONTEXT__: React.PropTypes.object,
    }
    
    const childContextTypes = {
      __REFLOW_PARENT_CONTEXT__: React.PropTypes.object,
      enterParent: React.PropTypes.func,
      dispatch: React.PropTypes.func,
    }
    
    const initialState = {};
    
    /** @type {string[]} */
    const reducers = this._reducers || {};
    const reducerKeys = Object.keys(reducers);
    if (reducerKeys.length > 0) reducerKeys.forEach(k => childContextTypes[k] = React.PropTypes.any);
    
    /** @type {Function[]} */
    const backgrounds = (this._backgrounds && this._backgrounds.size > 0) ? Array.from(this._backgrounds) : [];
    
    /** @type {any[]} */
    const constants = this._constants || {};
    const constantKeys = Object.keys(constants);
    if (constantKeys.length > 0) constantKeys.forEach(k => {
      childContextTypes[k] = React.PropTypes.any;
      initialState[k] = constants[k];
    });
    
    // create context component class
    class Component extends React.Component {
      state = initialState;
      
      static contextTypes = contextTypes;
      static childContextTypes = childContextTypes;
      
      getChildContext() {
        const context = {
          __REFLOW_PARENT_CONTEXT__: this,
          enterParent: this.context && this.context.__REFLOW_PARENT_CONTEXT__ && this.context.__REFLOW_PARENT_CONTEXT__.enterParent,
          dispatch: this.dispatch,
        }
        reducerKeys.forEach(k => context[k] = this.state[k]);
        constantKeys.forEach(k => context[k] = this.state[k]);
        return context;
      }
      
      static propTypes = {
        initialStates: React.PropTypes.object,
      }
      
      dispatch = action => {
        Promise.resolve(action).then(action => {
          if (isPlainObject(action)) {
            const context = {};
            let changed = false;
            
            reducerKeys.forEach(k => {
              const current = this.store[k];
              const next = reducers[k](current, action);
              if (current !== next) {
                this.store[k] = next;
                context[k] = next;
                changed = true;
              }
            });
            
            if (changed) this.setState(context);
          } else if (typeof action === 'function') {
            this.dispatch(action(this._getReflowContext()));
          }
        });
      }
      
      enterParent = fn => {
        fn(this._getReflowContext());
      }
      
      render() {
        return this.props.children;
      }
      
      _getReflowContext = () => {
        if (this.context.__REFLOW_PARENT_CONTEXT__) {
          return Object.assign(
            {},
            this.context.__REFLOW_PARENT_CONTEXT__._getReflowContext(),
            this.getChildContext()
          );
        }
        return this.getChildContext();
      }
      
      componentWillMount() {
        if (this.props.initialStates) {
          this.store = this.props.initialStates;
          this.setState(this.props.initialStates);
        } else {
          this.store = {};
        }
        this.dispatch({type: '__REFLOW_INIT__'});
      }
      
      componentDidMount() {
        this.unsubscribes = backgrounds.map(bg => bg(this._getReflowContext()));
      }
      
      componentWillUnmount() {
        this.unsubscribes.forEach(unsubscribe => unsubscribe());
      }
    }
    
    return Component;
  }
}

/** @return {Context} */
export function createContext() {
  return new Context;
}