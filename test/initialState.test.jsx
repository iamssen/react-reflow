import {createContext} from '../src/index';
import React from 'react';
import {mount} from 'enzyme';
import next from './next';

describe('initialState', () => {
  const UPDATE_STATE1 = 'UPDATE_STATE1';
  const UPDATE_STATE2 = 'UPDATE_STATE2';
  const UPDATE_STATE3 = 'UPDATE_STATE3';
  const UPDATE_STATE4 = 'UPDATE_STATE4';
  
  const state1 = (state = 'default', action) => {
    if (action.type === UPDATE_STATE1) return action.state1;
    return state;
  }
  
  const state2 = (state = 'default', action) => {
    if (action.type === UPDATE_STATE1) return action.state1;
    return state;
  }
  
  const state3 = (state = 'default', action) => {
    if (action.type === UPDATE_STATE1) return action.state1;
    return state;
  }
  
  const state4 = (state = 'default', action) => {
    if (action.type === UPDATE_STATE1) return action.state1;
    return state;
  }
  
  const Context = createContext()
    .reducers({state1, state2, state3, state4})
    .toComponent()
  
  class Component extends React.Component {
    static contextTypes = {
      state1: React.PropTypes.string,
      state2: React.PropTypes.string,
      state3: React.PropTypes.string,
      state4: React.PropTypes.string,
    }
    
    render() {
      return (
        <div>
          {this.context.state1}
          {this.context.state2}
          {this.context.state3}
          {this.context.state4}
        </div>
      )
    }
  }
  
  it('states should set their reducer default state', () => {
    const comp = mount(
      <Context>
        <Component/>
      </Context>
    )
    
    return next()
      .then(() => {
        expect(comp.find(Component).node.context.state1).toEqual('default');
        expect(comp.find(Component).node.context.state2).toEqual('default');
        expect(comp.find(Component).node.context.state3).toEqual('default');
        expect(comp.find(Component).node.context.state4).toEqual('default');
      })
  })
  
  it('states should set initial states', () => {
    const comp = mount(
      <Context initialStates={{state1: 'state1', state2: 'state2'}}>
        <Component/>
      </Context>
    )
    
    return next()
      .then(() => {
        expect(comp.find(Component).node.context.state1).toEqual('state1');
        expect(comp.find(Component).node.context.state2).toEqual('state2');
        expect(comp.find(Component).node.context.state3).toEqual('default');
        expect(comp.find(Component).node.context.state4).toEqual('default');
      })
  })
});