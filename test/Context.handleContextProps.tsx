import * as React from 'react';
import {provide, createContext} from '../src';
import {timer} from './utils';
import {mount} from 'enzyme';

const createComponent = (component) => {
  return provide({
    mapState: observe => observe('a', 'b', 'c'),
    mapHandlers: ({dispatch}) => ({
      updateA: a => dispatch({a}),
      updateB: b => dispatch({b}),
    })
  })(component)
}

describe('<Context>:handleContextProps', () => {
  it('내부 변화가 바깥으로 알려진다', () => {
    const mock = jest.fn();
    
    const Context = createContext({
      state: {
        a: 1,
        b: 2,
        c: observe => observe('a', 'b').map(({a, b}) => a + b),
      },
      handleContextProps: ({observe}, getContextProps) => {
        const subscription = observe('c').subscribe(({c}) => {
          const contextProps = getContextProps();
          contextProps.onChange(c);
        })
        
        return () => {
          subscription.unsubscribe();
        }
      }
    });
    
    const Component = createComponent(({updateA}) => {
      return <button className="trigger" onClick={() => updateA(100)}/>
    })
    
    const wrapper = mount(
      <Context onChange={c => mock(c)}>
        <Component/>
      </Context>
    )
    
    return timer(1)
      .then(() => {
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0][0]).toEqual(3);
        wrapper.find('.trigger').simulate('click');
        return timer(1);
      })
      .then(() => {
        expect(mock.mock.calls.length).toEqual(2);
        expect(mock.mock.calls[1][0]).toEqual(102);
        wrapper.find('.trigger').simulate('click');
        return timer(1);
      })
      .then(() => {
        expect(mock.mock.calls.length).toEqual(3);
        expect(mock.mock.calls[2][0]).toEqual(102);
      })
  })
})