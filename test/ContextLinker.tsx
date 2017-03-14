import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {jsdom} from 'jsdom';
import {mount} from 'enzyme';
import {createContext, provide, ContextLinker} from '../src';
import {timer} from './utils';

const createTestContext = () => {
  return createContext({
    state: {
      a: 1,
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

describe('<ContextLinker>', () => {
  it('JSDOM이 정상적으로 동작하는지 확인', () => {
    const document: Document = jsdom('<div class="container"></div>');
    const div: HTMLDivElement = document.createElement('div');
    document.querySelector('.container').appendChild(div);
    
    ReactDOM.render((<div className="result">Hello World</div>), div);
    expect(document.querySelector('.result').textContent).toEqual('Hello World');
  })
  
  it('Popup같이 React Context 외부 영역의 Document에 Context Linker를 통해 정상적으로 출력된다.', () => {
    const document: Document = jsdom('<div class="container"></div>');
    
    const Context = createTestContext();
    const Result = createComponent(({a, b, c}) => {
      return <div className="result">{a} + {b} = {c}</div>;
    })
    const Update = createComponent(({updateA}) => {
      return <button className="update" onClick={() => updateA(10)}></button>
    })
    
    class Launch extends React.Component<{}, {}> {
      linker: ContextLinker;
      
      render() {
        return (
          <div>
            <ContextLinker ref={r => this.linker = r}/>
            <button className="launchComponent"
                    onClick={() => this.launchComponent()}/>
          </div>
        )
      }
      
      launchComponent = () => {
        const div: HTMLDivElement = document.createElement('div');
        document.querySelector('.container').appendChild(div);
        
        this.linker.renderComponent(<Result/>, div);
      }
    }
    
    const wrapper = mount(
      <Context>
        <Launch/>
        <Update/>
      </Context>
    )
    
    return timer(1)
      .then(() => {
        wrapper.find('.launchComponent').simulate('click');
        return timer(1);
      })
      .then(() => {
        expect(document.querySelector('.result').textContent).toEqual('1 + 2 = 3');
        wrapper.find('.update').simulate('click');
        return timer(1);
      })
      .then(() => {
        expect(document.querySelector('.result').textContent).toEqual('10 + 2 = 12');
      })
  })
})