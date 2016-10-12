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

## Create Actions and Reducer

```
// actions.js
export const UPDATE_STATE = 'updateState';

export const updateState(newState) => {
  return {
    type: UPDATE_STATE,
    state: newState,
  }
}
```

```
// reducer.js
import { UPDATE_STATE } from './actions';

export const state = (state = 'default value', action) => {
  if (action.type === UPDATE_STATE) return action.state;
  return state;
}
```

## Create Context
```
// context.js
import { createContext } from 'react-reflow';
import { state } from './reducer';

export const Context = createContext()
                          .reducers({state})
                          .toComponent()
```

## Create Components
```
// StateView.jsx
import React from 'react';

export class StateView extends React.Component {
  static contextTypes = {
    state: React.PropTypes.string, // reducer `state`
  }
  
  render() {
    return <span>{this.context.state}</span>;
  }
}
```

```
// StateUpdater.jsx
import React from 'react';
import { updateState } from './actions';

export class StateUpdater extends React.Component {
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
```

## Create App
```
// app.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Context } from './context';
import { StateView } from './StateView';
import { StateUpdater } from './StateUpdater';

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

## View this basic sample on Codepen

<http://codepen.io/iamssen/pen/zKjQLY>
