import React from 'react';
import ReactDOM from 'react-dom';
import {createContext} from 'react-reflow';

const rand = () => Math.floor(Math.random() * 1000);

// ---------------------------------------------
// actions
// ---------------------------------------------
const UPDATE_X = 'UPDATE_X';
const UPDATE_Y = 'UPDATE_Y';

const plainAction = () => {
  return {
    type: UPDATE_X,
    x: 'Plain Action - ' + rand()
  };
}

const promiseAction = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        type: UPDATE_X,
        x: 'Promise Action - ' + rand(),
      });
    }, 1000);
  });
}

const thunkAction = () => ({dispatch}) => {
  setTimeout(() => {
    dispatch({
      type: UPDATE_X,
      x: 'Thunk Action - ' + rand(),
    });
  }, 1000);
}

const toParentAction = () => ({enterParent}) => {
  enterParent(({dispatch}) => {
    dispatch({
      type: UPDATE_X,
      x: 'To Parent from Child - ' + rand(),
    });
  });
}

// ---------------------------------------------
// reducers
// ---------------------------------------------
const x = (state = 'none', action) => {
  if (action.type === UPDATE_X) return action.x;
  return state;
}

const y = (state = 'none', action) => {
  if (action.type === UPDATE_Y) return action.y;
  return state;
}

// ---------------------------------------------
// backgrounds
// ---------------------------------------------
const backgroundService = ({dispatch}) => {
  const intervalId = setInterval(() => {
    console.log('Background Service - ' + Date.now());
  }, 500);
  return () => {
    clearInterval(intervalId);
  }
}

// ---------------------------------------------
// contexts
// ---------------------------------------------
const TopContext = createContext()
  .reducers({x})
  // .backgrounds(backgroundService)
  .toComponent();

const GroupContext = createContext()
  .reducers({y})
  .toComponent();

// ---------------------------------------------
// components
// ---------------------------------------------
class A extends React.Component {
  static contextTypes = {
    x: React.PropTypes.string,
    dispatch: React.PropTypes.func,
  };
  
  render() {
    return (
      <div style={{border: '1px solid black', padding: '15px'}}>
        <h1>{this.context.x}</h1>
        <button onClick={this.dispatchPlain}>Dispatch Plain Action</button>
        <button onClick={this.dispatchPromise}>Dispatch Promise Action</button>
        <button onClick={this.dispatchThunk}>Dispatch Thunk Action</button>
        {this.props.children}
      </div>
    );
  }
  
  dispatchPlain = () => {
    this.context.dispatch(plainAction());
  }
  
  dispatchPromise = () => {
    this.context.dispatch(promiseAction());
  }
  
  dispatchThunk = () => {
    this.context.dispatch(thunkAction());
  }
}

class B extends React.Component {
  static contextTypes = {
    x: React.PropTypes.string,
    y: React.PropTypes.string,
    dispatch: React.PropTypes.func,
    enterParent: React.PropTypes.func,
  }
  
  render() {
    return (
      <div style={{border: '1px solid black', padding: '15px', marginTop: '10px'}}>
        <h1>{this.context.x} : {this.context.y}</h1>
        <button onClick={this.toParentWithEnterParent}>To Parent With enterParent()</button>
        <button onClick={this.toParentAction}>To Parent Action</button>
        <button onClick={this.dispatch}>Dispatch Internal</button>
      </div>
    );
  }
  
  dispatch = () => {
    this.context.dispatch({
      type: UPDATE_Y,
      y: 'Internal Value - ' + rand(),
    });
  }
  
  toParentWithEnterParent = () => {
    this.context.enterParent(({dispatch}) => {
      dispatch({
        type: UPDATE_X,
        x: 'From Child - ' + rand(),
      });
    });
  }
  
  toParentAction = () => {
    this.context.dispatch(toParentAction());
  }
}

// ---------------------------------------------
// render
// ---------------------------------------------
ReactDOM.render((
  <TopContext initialStates={{x: 'Initial Value...'}}>
    <A>
      <GroupContext>
        <B/>
      </GroupContext>
      <GroupContext>
        <B/>
      </GroupContext>
      <GroupContext>
        <B/>
      </GroupContext>
      <GroupContext>
        <div style={{border: '1px solid black', padding: '10px', marginTop: '10px'}}>
          <B/>
          <B/>
        </div>
      </GroupContext>
    </A>
  </TopContext>
), document.querySelector('#app'));