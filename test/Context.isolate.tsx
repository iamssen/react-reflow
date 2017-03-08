import * as React from 'react';
import {createContext} from '../src';
import {timer} from './utils';
import {mount} from 'enzyme';

describe('<Context>:isolated', () => {
  it('고립된 Context는 상위 Context를 무시하고 하위 Context에 연결되지 않는다.', () => {
    const Context = createContext({
      state: {
        a: 1,
      }
    })
    
    const ChildContext = createContext({
      state: {
        b: 2,
        c: observe => observe('a', 'b').map(({a, b}) => a + b),
      }
    })
    
    const IsolatedContext = createContext({
      isolate: true,
      state: {
        d: 3,
      }
    })
    
    const wrapper = mount(
      <Context>
        <div>
          <IsolatedContext>
            <div>
              <ChildContext>
                <div>.</div>
              </ChildContext>
            </div>
          </IsolatedContext>
        </div>
      </Context>
    )
    
    return timer(1).then(() => {
      expect(wrapper.find(Context).node.hasState('a')).toBeTruthy();
      expect(wrapper.find(IsolatedContext).node.hasState('a')).toBeFalsy();
      expect(wrapper.find(IsolatedContext).node.hasState('b')).toBeFalsy();
      expect(wrapper.find(IsolatedContext).node.hasState('c')).toBeFalsy();
      expect(wrapper.find(IsolatedContext).node.hasState('d')).toBeTruthy();
      expect(wrapper.find(ChildContext).node.hasState('a')).toBeTruthy();
      expect(wrapper.find(ChildContext).node.hasState('b')).toBeTruthy();
      expect(wrapper.find(ChildContext).node.hasState('c')).toBeTruthy();
      expect(wrapper.find(ChildContext).node.hasState('d')).toBeFalsy();
    })
  })
})