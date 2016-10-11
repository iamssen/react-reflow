import {createContext} from '../src/index';
import React from 'react';
import {mount} from 'enzyme';
import next from './next';

describe('dispatch and actions multiple context', () => {
  const UPDATE_PARENT_VALUE = 'UPDATE_PARENT_VALUE';
  const UPDATE_LOCAL_VALUE = 'UPDATE_LOCAL_VALUE';
  const UPDATE_CHECK_PARENT = 'UPDATE_CHECK_PARENT';
  const UPDATE_CHECK_LOCAL = 'UPDATE_CHECK_LOCAL';
  
  const updateParentValue = parentValue => {
    return {type: UPDATE_PARENT_VALUE, parentValue};
  }
  
  const updateLocalValue = localValue => {
    return {type: UPDATE_LOCAL_VALUE, localValue};
  }
  
  const updateCheckParent = () => ({dispatch, enterParent, parentValue, checkParent}) => {
    const check = typeof dispatch === 'function'
      && typeof enterParent === 'undefined'
      && typeof parentValue === 'string'
      && typeof checkParent === 'boolean';
    
    dispatch({type: UPDATE_CHECK_PARENT, checkParent: check});
  }
  
  const updateCheckLocal = () => ({dispatch, enterParent, parentValue, localValue, checkParent, checkLocal}) => {
    const check = typeof dispatch === 'function'
      && typeof enterParent === 'function'
      && typeof parentValue === 'string'
      && typeof localValue === 'string'
      && typeof checkParent === 'boolean'
      && typeof checkLocal === 'boolean';
    
    dispatch({type: UPDATE_CHECK_LOCAL, checkLocal: check});
  }
  
  const parentValue = (state = 'default', action) => {
    if (action.type === UPDATE_PARENT_VALUE) return action.parentValue;
    return state;
  }
  
  const localValue = (state = 'default', action) => {
    if (action.type === UPDATE_LOCAL_VALUE) return action.localValue;
    return state;
  }
  
  const checkParent = (state = false, action) => {
    if (action.type === UPDATE_CHECK_PARENT) return action.checkParent;
    return state;
  }
  
  const checkLocal = (state = false, action) => {
    if (action.type === UPDATE_CHECK_LOCAL) return action.checkLocal;
    return state;
  }
  
  const ParentContext = createContext()
    .reducers({parentValue, checkParent})
    .toComponent()
  
  const LocalContext = createContext()
    .reducers({localValue, checkLocal})
    .toComponent()
  
  class ParentComponent extends React.Component {
    static contextTypes = {
      parentValue: React.PropTypes.string,
      checkParent: React.PropTypes.bool,
      dispatch: React.PropTypes.func,
    }
    
    render() {
      return (
        <div>
          <h1>{this.context.parentValue} : {this.context.checkParent}</h1>
          <div>
            {this.props.children}
          </div>
        </div>
      )
    }
    
    updateParentValue = parentValue => {
      this.context.dispatch(updateParentValue(parentValue));
    }
    
    updateCheckParent = () => {
      this.context.dispatch(updateCheckParent());
    }
  }
  
  class LocalComponent extends React.Component {
    static contextTypes = {
      parentValue: React.PropTypes.string,
      localValue: React.PropTypes.string,
      checkParent: React.PropTypes.bool,
      checkLocal: React.PropTypes.bool,
      dispatch: React.PropTypes.func,
      enterParent: React.PropTypes.func,
    }
    
    render() {
      return (
        <div>{this.context.parentValue} : {this.context.checkParent} : {this.context.localValue} : {this.context.checkLocal}</div>
      )
    }
    
    updateParentValue = parentValue => {
      this.context.enterParent(({dispatch}) => {
        dispatch(updateParentValue(parentValue));
      })
    }
    
    updateLocalValue = localValue => {
      this.context.dispatch(updateLocalValue(localValue));
    }
    
    updateCheckLocal = () => {
      this.context.dispatch(updateCheckLocal());
    }
  }
  
  it('dispatch actions to parent should update state', () => {
    const comp = mount(
      <ParentContext>
        <ParentComponent>
          <LocalContext>
            <LocalComponent/>
          </LocalContext>
          <LocalContext>
            <LocalComponent/>
          </LocalContext>
        </ParentComponent>
      </ParentContext>
    )
    
    return next()
      .then(() => {
        expect(comp.find(ParentComponent).node.context.parentValue).toEqual('default');
        expect(comp.find(LocalComponent).nodes[0].context.parentValue).toEqual('default');
        expect(comp.find(LocalComponent).nodes[1].context.parentValue).toEqual('default');
        
        comp.find(ParentComponent).node.updateParentValue('parent');
        return next();
      })
      .then(() => {
        expect(comp.find(ParentComponent).node.context.parentValue).toEqual('parent');
        expect(comp.find(LocalComponent).nodes[0].context.parentValue).toEqual('parent');
        expect(comp.find(LocalComponent).nodes[1].context.parentValue).toEqual('parent');
        
        expect(comp.find(ParentComponent).node.context.checkParent).toEqual(false);
        expect(comp.find(LocalComponent).nodes[0].context.checkParent).toEqual(false);
        expect(comp.find(LocalComponent).nodes[1].context.checkParent).toEqual(false);
        
        comp.find(ParentComponent).node.updateCheckParent();
        return next();
      })
      .then(() => {
        expect(comp.find(ParentComponent).node.context.checkParent).toEqual(true);
        expect(comp.find(LocalComponent).nodes[0].context.checkParent).toEqual(true);
        expect(comp.find(LocalComponent).nodes[1].context.checkParent).toEqual(true);
        
        expect(comp.find(LocalComponent).nodes[0].context.localValue).toEqual('default');
        expect(comp.find(LocalComponent).nodes[1].context.localValue).toEqual('default');
        
        comp.find(LocalComponent).nodes[0].updateLocalValue('local');
        return next();
      })
      .then(() => {
        expect(comp.find(LocalComponent).nodes[0].context.localValue).toEqual('local');
        expect(comp.find(LocalComponent).nodes[1].context.localValue).toEqual('default');
        
        expect(comp.find(LocalComponent).nodes[0].context.checkLocal).toEqual(false);
        expect(comp.find(LocalComponent).nodes[1].context.checkLocal).toEqual(false);
        
        comp.find(LocalComponent).nodes[0].updateCheckLocal();
        return next();
      })
      .then(() => {
        expect(comp.find(LocalComponent).nodes[0].context.checkLocal).toEqual(true);
        expect(comp.find(LocalComponent).nodes[1].context.checkLocal).toEqual(false);
      })
  })
})