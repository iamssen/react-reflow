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
  const { createContext } = Reflow;
</script>
```

# Basic Sample

```
import React from 'react';
import ReactDOM from 'react-dom';
import { createContext } from 'react-reflow';

// ---------------------------------------------
// actions
// ---------------------------------------------
const UPDATE_STATE = 'updateState';

const updateState = (newState) => {
  return {
    type: UPDATE_STATE,
    state: newState,
  }
}

// ---------------------------------------------
// reducer
// ---------------------------------------------
const state = (state = 'default value', action) => {
  if (action.type === UPDATE_STATE) return action.state;
  return state;
}

// ---------------------------------------------
// context
// ---------------------------------------------
const Context = createContext()
                    .reducers({state}) // add reducer
                    .toComponent()

// ---------------------------------------------
// components
// ---------------------------------------------
class StateView extends React.Component {
  static contextTypes = {
    state: React.PropTypes.string, // reducer `state`
  }
  
  render() {
    return <span>{this.context.state}</span>;
  }
}

class StateUpdater extends React.Component {
  static contextTypes = {
    dispatch: React.PropTypes.func,
  }
  
  render() {
    return <button onClick={() => this.updateState()}>Update random value</button>
  }
  
  updateState() {
    const newState = 'New state ' + Math.floor(Math.random() * 1000);
    this.context.dispatch(updateState(newState));
  }
}

// ---------------------------------------------
// app
// ---------------------------------------------
ReactDOM.render((
  <Context>
    <div>
      <div>
        <StateView/>
      </div>
      <div>
        <StateUpdater/>
      </div>
    </div>
  </Context>
), document.querySelector('#app'));
```

View this basic sample on Codepen <http://codepen.io/iamssen/pen/zKjQLY>
