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

describe('<Provider>:mapHandlers', () => {
  it('mapHandlers가 없어도 정상적으로 작동되어야 한다', () => {
    const provider = {
      mapState: observe => observe('a', 'b', 'c'),
    }
    
    const Component = provide(provider)(({a, b, c}) => {
      return <div className="result">{a} + {b} = {c}</div>;
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
})