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

describe('<Context>:receiveContextProps', () => {
  it('사용이 제한된 prop name은 차단된다', () => {
    const Context = createContext({
      state: {
        a: 1,
      },
      receiveContextProps: ({dispatch}) => ({
        children: (prev, next) => dispatch({a: next})
      })
    });
    
    expect(() => {
      mount(
        <Context>
          <div>.</div>
        </Context>
      )
    }).toThrow();
  })
  
  it('같은 값이 들어오면 실행되지 않는다', () => {
    const mock = jest.fn();
    
    const Context = createContext({
      state: {
        a: 1
      },
      receiveContextProps: ({dispatch}) => ({
        external: mock,
      })
    });
    
    class Container extends React.Component<{}, {external: number}> {
      state = {
        external: 100,
      }
      
      render() {
        return (
          <div>
            <Context external={this.state.external}>
              <div>.</div>
            </Context>
            <button className="externalUpdater" onClick={() => this.setState({external: 1000})}/>
          </div>
        )
      }
    }
    
    const wrapper = mount(<Container/>);
    const updateCount = () => {
      wrapper.find('.externalUpdater').simulate('click');
      return timer(1);
    }
    
    return timer(1)
      .then(updateCount)
      .then(updateCount)
      .then(updateCount)
      .then(updateCount)
      .then(updateCount)
      .then(() => {
        expect(mock.mock.calls.length).toEqual(2);
        expect(mock.mock.calls[0][1]).toEqual(100);
        expect(mock.mock.calls[1][1]).toEqual(1000);
      })
  })
  
  it('<Context props={?}>로 입력된 값이 잘 적용되어야 한다.', () => {
    const Context = createContext({
      state: {
        a: 1,
        b: 2,
        c: observe => observe('a', 'b').map(({a, b}) => a + b),
      },
      receiveContextProps: ({dispatch}) => ({
        external: (prev, next) => dispatch({a: next})
      })
    });
    const Component = createComponent(({a, b, c}) => {
      return <div className="result">{a} + {b} = {c}</div>
    })
    
    class Container extends React.Component<{}, {external: number}> {
      state = {
        external: 100,
      }
      
      render() {
        return (
          <div>
            <Context external={this.state.external}>
              <Component/>
            </Context>
            <button className="externalUpdater" onClick={() => this.setState({external: 1000})}/>
          </div>
        )
      }
    }
    
    const wrapper = mount(<Container/>)
    
    return timer(1)
      .then(() => {
        expect(wrapper.find('.result').text()).toEqual('100 + 2 = 102');
        wrapper.find('.externalUpdater').simulate('click');
        return timer(1);
      })
      .then(() => {
        expect(wrapper.find('.result').text()).toEqual('1000 + 2 = 1002');
      })
  })
})