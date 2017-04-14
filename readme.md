# Status

<img src="https://travis-ci.org/iamssen/react-reflow.svg?branch=master"/>

# Installation

```
npm install react-reflow --save
```

# References

- [Reflow Seed Project](https://github.com/iamssen/react-reflow-seed)
- [한글문서](https://github.com/iamssen/react-reflow/wiki/01.-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0)

-----

# Reflow는 무엇인가요?

Reflow는 React의 State를 좀 더 편리하게 관리하기 위해 만들어진 State Container Framework 입니다.

React에는 이미 Redux라는 훌륭한 State Container Framework이 있습니다. Reflow는 Redux를 사용하면서 만족스럽지 못했던 부분들을 개선해보려한 이런저런 시도들의 결과물입니다.

특징으로 이야기할 수 있는 부분은 아래와 같습니다.

1. **계층형의 Multiple Context를 지원합니다.** Redux를 기준으로 이야기하자면 Store를 여러개 만들 수 있고, 각 Store들을 Parent - Children의 계층 관계로 묶을 수 있다는 이야기입니다. 이는 SPA (Single Page Application)처럼 Layout - Content와 같은 계층형 구조가 있으면서, 하위의 Content가 지속적으로 교체되는 구조를 만들때 장점이 있습니다.
    - 다만, 이 Multiple Context 지원은 React 개발진들이 그리 추천하지 않는 React Context를 기반으로  만들어져있습니다. Reflow는 어찌보면 불안정한 (React 개발자들이 추천하지 않고, 숨겨놓은) API를 바탕으로 만들어진 Framework라 할 수 있습니다.
2. 물리적인 특징은 1번의 계층형 Multiple Context 이외에는 별로 없습니다. **API의 구조가 많이 다른편인데 이는 개인적인 취향이 많이 적용되어 있다고 할 수 있습니다.** 초반에는 단순히 Multiple Context를 지원하는 Redux를 만들려 했을 뿐이라서 Redux의 API를 많이 흉내냈었지만, 작업이 계속되면서 꽤나 많은 부분이 달라진것 같습니다.
    - 개인적으로 Server Rendering과 같은 복합적인 기술들에는 큰 관심이 없는 편이라서, 그냥 UI Application을 단순하고 편리하게 작성하는데만 촛점을 맞춘 편입니다.

# 참고자료들

- [react-reflow-seed](https://github.com/iamssen/react-reflow-seed)

# 기초적인 샘플 만들어보기

> 아래의 샘플은 <https://embed.plnkr.co/rhyniP/> (js) <https://embed.plnkr.co/gSkl9D/> (typescript) 에서 실행해 볼 수 있습니다.

## Context

```js
// ~/context.js
import { createContext } from 'react-reflow';

export default createContext({
  state: {
    a: 1,
    b: 2,
    c: observe => observe('a', 'b').map(({a, b}) => a + b),
  }
});
```

간단하게 Sum 동작을 하는 Context를 만들어보겠습니다.

1. `a`와 `b`는 읽고, 쓸 수 있는 State가 됩니다. 초기값으로 `1` 과 `2`가 입력되고 있습니다.
2. `c`와 같이 `observe => Observable`을 통해서 다른 State들을 참조, 변형시키는 형태의 State를 만들수도 있습니다. 이러한 State는 읽기만 가능합니다.

> `observe(…keys: string[])`는 RxJs `Observable`을 Return 합니다.

## Action

```js
// ~/actions/updateA.js
export default n => {
  return { a: n };
}


// ~/actions/updateB.js
export default n => {
  return { b: n };
}
```

Action이 반환하는 `a`와 `b`는 Context의 State를 업데이트 하게 됩니다.

> Reflow의 Action은 Redux와 다릅니다. Redux는 `{ type: 'actionName', value: * }`와 같은 형태로 Reducer에 전달되는 Command 역할을 하지만, Reflow는  `{ stateName: value }` 형태로 state를 직접 업데이트 시킵니다.

## Provider

```js
// ~/providers/provideEditor.js
import updateA from '../actions/updateA';
import updateB from '../actions/updateB';

export default {
  mapState: observe => observe('a', 'b', 'c'),
  mapHandlers: ({dispatch}) => ({
    updateA: n => dispatch(updateA(n)),
    updateB: n => dispatch(updateB(n)),
  })
}
```

위의 Provider를 분석해보자면

1. `mapState: observe => observe('a', 'b', 'c')`는 Component에서 `this.props.a`, `this.props.b`, `this.props.c`로 연결됩니다.
2. `mapHandlers`가 반환하는 `updateA`, `updateB`는 Component에서 `this.props.updateA`, `this.props.updateB`가 됩니다.


> Provider는 Component가 Reflow에 종속되지 않도록 돕습니다.
> Reflow의 동작과는 상관없는 순수한 React Component를 만들고, (Reflow의 State를 연결하거나, Reflow로 Action을 Dispatch를 한다거나 하는) 실제적인 Reflow와의 연결은 Provider가 담당하게 됩니다. (Component와 Provider의 결합은 아래쪽에서 설명됩니다)

## Component

```js
// ~/components/Editor.jsx
import React, { Component } from 'react';

export default class extends Component {
  render() {
    return (
      <div>
        <input type="text"
               defaultValue={this.props.a}
               onChange={({target}) => this.props.updateA(Number(target.value))}/>
        +
        <input type="text"
               defaultValue={this.props.b}
               onChange={({target}) => this.props.updateB(Number(target.value))}/>
        =
        <span>{this.props.c}</span>
      </div>
    )
  }
}
```

Provider를 구현하는 Component 입니다. Provider에서 넘어오는 State인 `this.props.a`, `this.props.b`, `this.props.c` 를 사용하고 있고, 값의 변경이 발생하는 경우 `this.props.updateA()`, `this.props.updateB()` 를 호출하고 있습니다.

> Component의 작성은 Reflow의 동작에 신경 쓸 필요없이 Provider가 전달하는 Props의 구현에만 신경쓰면 되게끔 단순화 됩니다.

## Provider와 Component의 결합

```js
// ~/components.js
import { provide } from 'react-reflow';

import _Editor from './components/Editor';
import provideEditor from './providers/provideEditor';

export const Editor = provide(provideEditor)(_Editor);
```

`provide(Provider)(Component)`는 Reflow에 연결되어 작동되는 Component를 만듭니다.

## 결합

```js
// ~/app.jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Context from './context';
import { Editor } from './components';

const Main = () => (
  <div>
    <Context>
      <Editor/>
    </Context>
  </div>
)

ReactDOM.render(<Main/>, document.querySelector('#app'));
```

최종적으로 구성물들을 조립해서 동작시킵니다. `<Editor>`와 같은 ProvidedComponent (Provider와 연결된 Component)는 `<Context>` 하위에 있을때만 정상적으로 동작합니다.


> 위의 샘플은 <https://embed.plnkr.co/rhyniP/> (js) <https://embed.plnkr.co/gSkl9D/> (typescript) 에서 실행해 볼 수 있습니다.

