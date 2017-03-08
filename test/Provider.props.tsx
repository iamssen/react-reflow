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

describe('Provider.props', () => {
  it('정상적으로 state, handler를 내려받아야 함', () => {
    const mock = jest.fn();
    const provider = {
      mapState: observe => observe('a', 'b', 'c'),
      mapHandlers: ({dispatch}) => ({
        update: mock,
      })
    }
    
    const Component = provide(provider)(({a, b, c, update}) => {
      expect(a).toEqual(1);
      expect(b).toEqual(2);
      expect(c).toEqual(3);
      expect(update).toEqual(mock);
      return <div className="result">{a} + {b} = {c}</div>
    })
    
    const wrapper = mount(
      <Context>
        <Component/>
      </Context>
    )
    
    return timer(1).then(() => {
      expect(wrapper.find('.result').text()).toEqual('1 + 2 = 3');
    })
  })
  
  it('정상적으로 mixed된 state, handler를 내려받아야 함', () => {
    const mock1 = jest.fn();
    const mock2 = jest.fn();
    
    const provider1 = {
      mapState: observe => observe('a', 'b'),
      mapHandlers: ({dispatch}) => ({
        update1: mock1,
      })
    }
    
    const provider2 = {
      mapState: observe => observe('c'),
      mapHandlers: ({dispatch}) => ({
        update2: mock2,
      })
    }
    
    const Component = provide(provider1, provider2)(({a, b, c, update1, update2}) => {
      expect(a).toEqual(1);
      expect(b).toEqual(2);
      expect(c).toEqual(3);
      expect(update1).toEqual(mock1);
      expect(update2).toEqual(mock2);
      return <div className="result">{a} + {b} = {c}</div>
    })
    
    const wrapper = mount(
      <Context>
        <Component/>
      </Context>
    )
    
    return timer(1).then(() => {
      expect(wrapper.find('.result').text()).toEqual('1 + 2 = 3');
    })
  })
  
  it('같은 이름의 state, handler name은 후순위의 provider를 사용한다', () => {
    const mock1 = jest.fn();
    const mock2 = jest.fn();
    
    const provider1 = {
      mapState: observe => observe('a', 'b', 'c'),
      mapHandlers: ({dispatch}) => ({
        update: mock1,
      })
    }
    
    const provider2 = {
      mapState: observe => observe('a', 'b', 'c').map(({a, b, c}) => ({
        a: a * 100,
        c: c * 100,
      })),
      mapHandlers: ({dispatch}) => ({
        update: mock2,
      })
    }
    
    const Component = provide(provider1, provider2)(({a, b, c, update}) => {
      expect(a).toEqual(100);
      expect(b).toEqual(2);
      expect(c).toEqual(300);
      expect(update).toEqual(mock2);
      return <div className="result">{a} + {b} = {c}</div>
    })
    
    const wrapper = mount(
      <Context>
        <Component/>
      </Context>
    )
    
    return timer(1).then(() => {
      expect(wrapper.find('.result').text()).toEqual('100 + 2 = 300');
    })
  })
})