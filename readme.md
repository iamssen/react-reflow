# Status

<img src="https://travis-ci.org/iamssen/react-reflow.svg?branch=master"/>

# Installation

```
npm install react-reflow --save
```

or

```
<script src="https://unpkg.com/react-reflow/lib/reflow.js"></script>
<script>
  const { createContext, connect } = Reflow;
</script>
```

# Basic Sample

```
import React from 'react';
import ReactDOM from 'react-dom';
import { createContext, connect } from 'react-reflow';

const Context = createContext({
  state: {
    a: 1,
    b: 2,
    c: observe => observe('a', 'b').map(({a, b}) => a + b),
  }
})

const Connector = connect(observe => observe('a', 'b', 'c'))

const action = (a) => {
  return {a}
}

const Component = ({a, b, c, dispatch}) => {
  return (
    <div>
      <p>{a} + {b} = {c}</p>
      <button onClick={() => dispatch(action(10))}>Update A</button>
    </div>
  )
}

ReactDOM.render((
  <Context>
    <div>
      <Connector>
        <Component/>
      </Connector>
    </div>
  </Context>
), document.querySelector('#app'));
```