import * as React from 'react';
import {Store, provide, createContext} from '../src';
import {timer} from './utils';
import {mount} from 'enzyme';

const createStore = () => {
  return new Store({
    state: {
      a: 1,
    }
  })
}

const createTestContext = () => {
  return createContext({
    state: {
      b: 2,
      c: observe => observe('a', 'b').map(({a, b}) => a + b),
    }
  })
}

const createComponent = (component) => {
  return provide({
    mapState: observe => observe('a', 'b', 'c'),
    mapHandlers: ({dispatch}) => ({
      updateA: a => dispatch({a}),
      updateB: b => dispatch({b}),
    })
  })(component)
}

describe('<Context>:parentStore', () => {
  it('별도 입력한 Parent Store에 의한 값이 정상적으로 내려와야 한다', () => {
    const store = createStore();
    const Context = createTestContext();
    const Component = createComponent(({a, b, c}) => {
      return <div className="result">{a} + {b} = {c}</div>
    })
    
    const wrapper = mount(
      <Context parentStore={store}>
        <Component/>
      </Context>
    )
    
    return timer(1).then(() => {
      expect(wrapper.find('.result').text()).toEqual('1 + 2 = 3');
    })
  })
  
  it('내부 동작을 통해서 Parent Store의 값을 변경한다', () => {
    const store = createStore();
    const Context = createTestContext();
    const Component = createComponent(({a, b, c, updateA}) => {
      return (
        <div>
          <button className="trigger" onClick={() => updateA(100)}/>
          <div className="result">{a} + {b} = {c}</div>
        </div>
      )
    })
    
    const wrapper = mount(
      <Context parentStore={store}>
        <Component/>
      </Context>
    )
    
    return timer(1)
      .then(() => {
        wrapper.find('.trigger').simulate('click');
        return timer(1);
      })
      .then(() => {
        return store.observe('a').first().toPromise();
      })
      .then(({a}) => {
        expect(a).toEqual(100);
        expect(wrapper.find('.result').text()).toEqual('100 + 2 = 102');
      })
  })
})