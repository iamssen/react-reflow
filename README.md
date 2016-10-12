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

View this sample on Codepen <http://codepen.io/iamssen/pen/zKjQLY?editors=0010>

# Multi Context Sample

```
import React from 'react';
import ReactDOM from 'react-dom';
import { createContext } from 'react-reflow';

// ---------------------------------------------
// actions
// ---------------------------------------------
const UPDATE_PARENT_VALUE = 'updateParentValue';
const UPDATE_LOCAL_VALUE = 'updateLocalValue';

const updateParentValue = (newValue) => {
  return {
    type: UPDATE_PARENT_VALUE,
    value: newValue,
  }
}

const updateLocalValue = (newValue) => {
  return {
    type: UPDATE_LOCAL_VALUE,
    value: newValue,
  }
}

// ---------------------------------------------
// reducer
// ---------------------------------------------
const parentValue = (state = 'default parent value', action) => {
  if (action.type === UPDATE_PARENT_VALUE) return action.value;
  return state;
}

const localValue = (state = 'default local value', action) => {
  if (action.type === UPDATE_LOCAL_VALUE) return action.value;
  return state;
}

// ---------------------------------------------
// context
// ---------------------------------------------
const ParentContext = createContext()
  .reducers({parentValue})
  .toComponent()

const LocalContext = createContext()
  .reducers({localValue})
  .toComponent()

// ---------------------------------------------
// components
// ---------------------------------------------
class ParentComponent extends React.Component {
  static contextTypes = {
    parentValue: React.PropTypes.string,
    dispatch: React.PropTypes.func,
  }
  
  render() {
    return (
      <div style={{padding: '10px', border: '1px solid black'}}>
        <h1>parentValue = {this.context.parentValue}</h1>
        <div>
          <button onClick={() => this.update()}>Update random parent value</button>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
  
  update() {
    const newValue = 'parent value - ' + Math.floor(Math.random() * 1000);
    this.context.dispatch(updateParentValue(newValue));
  }
}

class LocalComponent extends React.Component {
  static contextTypes = {
    parentValue: React.PropTypes.string,
    localValue: React.PropTypes.string,
    dispatch: React.PropTypes.func,
  }
  
  render() {
    return (
      <div style={{padding: '10px', border: '1px solid black'}}>
        <h2>parentValue = {this.context.parentValue} / localValue = {this.context.localValue}</h2>
        <div>
          <button onClick={() => this.update()}>Update random local value</button>
        </div>
      </div>
    )
  }
  
  update() {
    const newValue = 'local value - ' + Math.floor(Math.random() * 1000);
    this.context.dispatch(updateLocalValue(newValue));
  }
}

// ---------------------------------------------
// app
// ---------------------------------------------
ReactDOM.render((
  <ParentContext>
    <ParentComponent>
      <LocalContext>
        <LocalComponent/>
      </LocalContext>
      <LocalContext>
        <LocalComponent/>
      </LocalContext>
      <LocalContext>
        <LocalComponent/>
      </LocalContext>
    </ParentComponent>
  </ParentContext>
), document.querySelector('#app'));
```

View this sample on Codepen <https://codepen.io/iamssen/pen/bwrPoJ?editors=0010>