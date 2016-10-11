import {createContext} from '../src/index';
import React from 'react';
import {mount} from 'enzyme';
import next from './next';

describe('dispatch and actions', () => {
  const delay = 100;
  
  const UPDATE_NUM = 'UPDATE_NUM';
  const UPDATE_PARAMETER_READY = 'UPDATE_PARAMETER_READY';
  
  const plainAction = num => {
    return {type: UPDATE_NUM, num};
  }
  
  const promiseAction = num => {
    return new Promise(resolve => {
      setTimeout(() => resolve({type: UPDATE_NUM, num}), Math.random() * 100);
    });
  }
  
  const thunkAction = num => ({dispatch}) => {
    setTimeout(() => dispatch({type: UPDATE_NUM, num}), Math.random() * 100);
  }
  
  const parameterReadyAction = () => ({dispatch, enterParent, num, parameterReady}) => {
    const ready = typeof dispatch === 'function'
      && typeof enterParent === 'undefined'
      && typeof num === 'number'
      && typeof parameterReady === 'boolean';
    
    dispatch({type: UPDATE_PARAMETER_READY, parameterReady: ready});
  }
  
  const num = (state = 1, action) => {
    if (action.type === UPDATE_NUM) return action.num;
    return state;
  }
  
  const parameterReady = (state = false, action) => {
    if (action.type === UPDATE_PARAMETER_READY) return action.parameterReady;
    return state;
  }
  
  const Context = createContext()
    .reducers({num, parameterReady})
    .toComponent();
  
  class Component extends React.Component {
    static contextTypes = {
      num: React.PropTypes.number,
      parameterReady: React.PropTypes.bool,
      dispatch: React.PropTypes.func,
    }
    
    render() {
      return <div>{this.context.num}</div>
    }
    
    updateNumByPlain = num => {
      this.context.dispatch(plainAction(num));
    }
    
    updateNumByPromise = num => {
      this.context.dispatch(promiseAction(num));
    }
    
    updateNumByThunk = num => {
      this.context.dispatch(thunkAction(num));
    }
    
    checkParameterReady = () => {
      this.context.dispatch(parameterReadyAction());
    }
  }
  
  it('dispatch actions should update state by reducers', () => {
    const comp = mount(
      <Context>
        <Component/>
      </Context>
    )
    
    return next()
      .then(() => {
        expect(comp.find('div').text()).toEqual('1');
        expect(comp.find(Component).node.context.num).toEqual(1);
        
        comp.find(Component).node.updateNumByPlain(5);
        return next();
      })
      .then(() => {
        expect(comp.find('div').text()).toEqual('5');
        expect(comp.find(Component).node.context.num).toEqual(5);
        
        comp.find(Component).node.updateNumByPromise(10);
        return next(delay);
      })
      .then(() => {
        expect(comp.find('div').text()).toEqual('10');
        expect(comp.find(Component).node.context.num).toEqual(10);
        
        comp.find(Component).node.updateNumByThunk(100);
        return next(delay);
      })
      .then(() => {
        expect(comp.find('div').text()).toEqual('100');
        expect(comp.find(Component).node.context.num).toEqual(100);
      })
  })
  
  it('thunk actions should get states', () => {
    const comp = mount(
      <Context>
        <Component/>
      </Context>
    )
    
    return next()
      .then(() => {
        expect(comp.find(Component).node.context.parameterReady).toEqual(false);
        
        comp.find(Component).node.checkParameterReady();
        return next();
      })
      .then(() => {
        expect(comp.find(Component).node.context.parameterReady).toEqual(true);
      })
  })
})
  