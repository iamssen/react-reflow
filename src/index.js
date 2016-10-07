import React from 'react';
import isPlainObject from 'lodash.isplainobject';

class Context {
  /** @return {Context} */
  reducers(reducers) {
    this._reducers = Object.assign(this._reducers || {}, reducers);
    return this;
  }
  
  /** @return {Context} */
  backgrounds(...backgrounds) {
    if (!this._backgrounds) this._backgrounds = new Set;
    backgrounds.filter(bg => !this._backgrounds.has(bg)).forEach(bg => this._backgrounds.add(bg));
    return this;
  }
  
  /** @return {React.Component} */
  toComponent() {
    const contextTypes = {
      __REFLOW_ENTER_PARENT__: React.PropTypes.func,
    }
    
    const childContextTypes = {
      __REFLOW_ENTER_PARENT__: React.PropTypes.func,
      enterParent: React.PropTypes.func,
      dispatch: React.PropTypes.func,
    }
    
    const reducers = this._reducers;
    const reducerNames = (reducers) ? Object.keys(reducers) : [];
    reducerNames.forEach(name => childContextTypes[name] = React.PropTypes.any);
    
    const backgrounds = this._backgrounds ? Array.from(this._backgrounds) : [];
    
    // create context component class
    class Component extends React.Component {
      state = {};
      
      static contextTypes = contextTypes; // from parent
      static childContextTypes = childContextTypes; // to children
      
      getChildContext() {
        const context = {
          __REFLOW_ENTER_PARENT__: this.enterParent,
          enterParent: this.context.__REFLOW_ENTER_PARENT__,
          dispatch: this.dispatch,
        }
        
        reducerNames.forEach(name => context[name] = this.state[name]);
        
        return context;
      }
      
      static propTypes = {
        initialStates: React.PropTypes.object,
      }
      
      dispatch = action => {
        Promise.resolve(action).then(action => {
          if (isPlainObject(action)) {
            const state = {};
            let changed = false;
            
            reducerNames.forEach(name => {
              const current = this.store[name];
              const next = reducers[name](current, action);
              if (current !== next) {
                this.store[name] = next;
                state[name] = next;
                changed = true;
              }
            });
            
            if (changed) this.setState(state);
          } else if (typeof action === 'function') {
            this.dispatch(action(this.getChildContext()));
          }
        });
      }
      
      enterParent = fn => {
        fn(this.getChildContext());
      }
      
      render() {
        return this.props.children;
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
        this.unsubscribes = backgrounds.map(bg => bg(this.getChildContext()));
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