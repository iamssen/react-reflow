import * as React from 'react';
import {provide, createContext} from '../src';
import {timer} from './utils';
import {mount} from 'enzyme';

const Context = createContext({
  state: {
    a: 1,
    b: 2,
    c: observe => observe('a', 'b').map(({a, b}) => a + b),
  }
})

describe('<Provider>:mapState', () => {
  it('mapState가 없어도 정상적으로 작동되어야 한다', () => {
    const mock = jest.fn();
    const provider = {
      mapHandlers: ({dispatch}) => ({
        update: mock,
      })
    }
    
    const Component = provide(provider)(({update}) => {
      expect(update).toEqual(mock);
      return (
        <div>
          <div className="result">Hello</div>
          <button className="trigger" onClick={() => update()}></button>
        </div>
      )
    })
    
    const wrapper = mount(
      <Context>
        <Component/>
      </Context>
    )
    
    return timer(1)
      .then(() => {
        expect(wrapper.find('.result').text()).toEqual('Hello');
        wrapper.find('.trigger').simulate('click');
        return timer(1);
      })
      .then(() => {
        expect(mock).toHaveBeenCalled();
      })
  })
})