import {createContext} from '../src/index';
import React from 'react';
import {mount} from 'enzyme';
import next from './next';

describe('enterParent', () => {
  const UPDATE_LEVEL1 = 'UPDATE_LEVEL1';
  const UPDATE_LEVEL2 = 'UPDATE_LEVEL2';
  const UPDATE_LEVEL3 = 'UPDATE_LEVEL3';
  const UPDATE_LEVEL4 = 'UPDATE_LEVEL4';
  const UPDATE_LEVEL5 = 'UPDATE_LEVEL5';
  
  const updateLevel1 = level1 => {
    return {type: UPDATE_LEVEL1, level1};
  }
  
  const updateLevel2 = level2 => {
    return {type: UPDATE_LEVEL2, level2};
  }
  
  const updateLevel3 = level3 => {
    return {type: UPDATE_LEVEL3, level3};
  }
  
  const updateLevel4 = level4 => {
    return {type: UPDATE_LEVEL4, level4};
  }
  
  const updateLevel5 = level5 => {
    return {type: UPDATE_LEVEL5, level5};
  }
  
  const level1 = (state = 'default', action) => {
    if (action.type === UPDATE_LEVEL1) return action.level1;
    return state;
  }
  
  const level2 = (state = 'default', action) => {
    if (action.type === UPDATE_LEVEL2) return action.level2;
    return state;
  }
  
  const level3 = (state = 'default', action) => {
    if (action.type === UPDATE_LEVEL3) return action.level3;
    return state;
  }
  
  const level4 = (state = 'default', action) => {
    if (action.type === UPDATE_LEVEL4) return action.level4;
    return state;
  }
  
  const level5 = (state = 'default', action) => {
    if (action.type === UPDATE_LEVEL5) return action.level5;
    return state;
  }
  
  const Level1Context = createContext()
    .reducers({level1})
    .toComponent()
  
  const Level2Context = createContext()
    .reducers({level2})
    .toComponent()
  
  const Level3Context = createContext()
    .reducers({level3})
    .toComponent()
  
  const Level4Context = createContext()
    .reducers({level4})
    .toComponent()
  
  const Level5Context = createContext()
    .reducers({level5})
    .toComponent()
  
  class Level1Component extends React.Component {
    static contextTypes = {
      level1: React.PropTypes.string,
      dispatch: React.PropTypes.func,
    }
    
    render() {
      return (
        <div>
          <h1>Level1 - {this.context.level1}</h1>
          <div>{this.props.children}</div>
        </div>
      )
    }
  }
  
  class Level2Component extends React.Component {
    static contextTypes = {
      level1: React.PropTypes.string,
      level2: React.PropTypes.string,
      dispatch: React.PropTypes.func,
      enterParent: React.PropTypes.func,
    }
    
    render() {
      return (
        <div>
          <h2>Level2 - {this.context.level2}</h2>
          <div>{this.props.children}</div>
        </div>
      )
    }
    
    checkEnterParent() {
      return new Promise(resolve => {
        this.context.enterParent(({level1, dispatch}) => {
          resolve(typeof level1 === 'string'
            && typeof dispatch === 'function');
        })
      })
    }
  }
  
  class Level3Component extends React.Component {
    static contextTypes = {
      level1: React.PropTypes.string,
      level2: React.PropTypes.string,
      level3: React.PropTypes.string,
      dispatch: React.PropTypes.func,
      enterParent: React.PropTypes.func,
    }
    
    render() {
      return (
        <div>
          <h3>Level3 - {this.context.level3}</h3>
          <div>{this.props.children}</div>
        </div>
      )
    }
    
    checkEnterParent() {
      return new Promise(resolve => {
        this.context.enterParent(({level1, level2, dispatch, enterParent}) => {
          resolve(typeof level1 === 'string'
            && typeof level2 === 'string'
            && typeof dispatch === 'function'
            && typeof enterParent === 'function');
        })
      })
    }
  }
  
  class Level4Component extends React.Component {
    static contextTypes = {
      level1: React.PropTypes.string,
      level2: React.PropTypes.string,
      level3: React.PropTypes.string,
      level4: React.PropTypes.string,
      dispatch: React.PropTypes.func,
      enterParent: React.PropTypes.func,
    }
    
    render() {
      return (
        <div>
          <h4>Level4 - {this.context.level4}</h4>
          <div>{this.props.children}</div>
        </div>
      )
    }
    
    checkEnterParent() {
      return new Promise(resolve => {
        this.context.enterParent(({level1, level2, level3, dispatch, enterParent}) => {
          resolve(typeof level1 === 'string'
            && typeof level2 === 'string'
            && typeof level3 === 'string'
            && typeof dispatch === 'function'
            && typeof enterParent === 'function');
        })
      })
    }
  }
  
  class Level5Component extends React.Component {
    static contextTypes = {
      level1: React.PropTypes.string,
      level2: React.PropTypes.string,
      level3: React.PropTypes.string,
      level4: React.PropTypes.string,
      level5: React.PropTypes.string,
      dispatch: React.PropTypes.func,
      enterParent: React.PropTypes.func,
    }
    
    render() {
      return (
        <div>
          <h5>Level5 - {this.context.level5}</h5>
        </div>
      )
    }
    
    checkEnterParent() {
      return new Promise(resolve => {
        this.context.enterParent(({level1, level2, level3, level4, dispatch, enterParent}) => {
          resolve(typeof level1 === 'string'
            && typeof level2 === 'string'
            && typeof level3 === 'string'
            && typeof level4 === 'string'
            && typeof dispatch === 'function'
            && typeof enterParent === 'function');
        })
      })
    }
  }
  
  it('multiple contexts should work well...', () => {
    const comp = mount(
      <Level1Context>
        <Level1Component>
          <Level2Context>
            <Level2Component>
              <Level3Context>
                <Level3Component>
                  <Level4Context>
                    <Level4Component>
                      <Level5Context>
                        <Level5Component/>
                      </Level5Context>
                    </Level4Component>
                  </Level4Context>
                </Level3Component>
              </Level3Context>
            </Level2Component>
          </Level2Context>
        </Level1Component>
      </Level1Context>
    )
    
    return next()
      .then(() => {
        expect(comp.find(Level1Component).node.context.level1).toEqual('default');
        expect(comp.find(Level2Component).node.context.level1).toEqual('default');
        expect(comp.find(Level3Component).node.context.level1).toEqual('default');
        expect(comp.find(Level4Component).node.context.level1).toEqual('default');
        expect(comp.find(Level5Component).node.context.level1).toEqual('default');
        
        expect(comp.find(Level2Component).node.context.level2).toEqual('default');
        expect(comp.find(Level3Component).node.context.level2).toEqual('default');
        expect(comp.find(Level4Component).node.context.level2).toEqual('default');
        expect(comp.find(Level5Component).node.context.level2).toEqual('default');
        
        expect(comp.find(Level3Component).node.context.level3).toEqual('default');
        expect(comp.find(Level4Component).node.context.level3).toEqual('default');
        expect(comp.find(Level5Component).node.context.level3).toEqual('default');
        
        expect(comp.find(Level4Component).node.context.level4).toEqual('default');
        expect(comp.find(Level5Component).node.context.level4).toEqual('default');
        
        expect(comp.find(Level5Component).node.context.level5).toEqual('default');
        
        return Promise.all([
          comp.find(Level2Component).node.checkEnterParent(),
          comp.find(Level3Component).node.checkEnterParent(),
          comp.find(Level4Component).node.checkEnterParent(),
          comp.find(Level5Component).node.checkEnterParent(),
        ])
      })
      .then(result => {
        expect(result.every(x => x)).toEqual(true);
        
        expect(comp.find(Level2Component).node.context.enterParent).toEqual(comp.find(Level1Context).node.enterParent);
        expect(comp.find(Level3Component).node.context.enterParent).toEqual(comp.find(Level2Context).node.enterParent);
        expect(comp.find(Level4Component).node.context.enterParent).toEqual(comp.find(Level3Context).node.enterParent);
        expect(comp.find(Level5Component).node.context.enterParent).toEqual(comp.find(Level4Context).node.enterParent);
        
        expect(comp.find(Level1Component).node.context.dispatch).toEqual(comp.find(Level1Context).node.dispatch);
        expect(comp.find(Level2Component).node.context.dispatch).toEqual(comp.find(Level2Context).node.dispatch);
        expect(comp.find(Level3Component).node.context.dispatch).toEqual(comp.find(Level3Context).node.dispatch);
        expect(comp.find(Level4Component).node.context.dispatch).toEqual(comp.find(Level4Context).node.dispatch);
        expect(comp.find(Level5Component).node.context.dispatch).toEqual(comp.find(Level5Context).node.dispatch);
        
        comp.find(Level1Component).node.context.dispatch(updateLevel1('level1'));
        comp.find(Level2Component).node.context.dispatch(updateLevel2('level2'));
        comp.find(Level3Component).node.context.dispatch(updateLevel3('level3'));
        comp.find(Level4Component).node.context.dispatch(updateLevel4('level4'));
        comp.find(Level5Component).node.context.dispatch(updateLevel5('level5'));
        
        return next();
      })
      .then(() => {
        expect(comp.find(Level1Component).node.context.level1).toEqual('level1');
        expect(comp.find(Level2Component).node.context.level1).toEqual('level1');
        expect(comp.find(Level3Component).node.context.level1).toEqual('level1');
        expect(comp.find(Level4Component).node.context.level1).toEqual('level1');
        expect(comp.find(Level5Component).node.context.level1).toEqual('level1');
        
        expect(comp.find(Level2Component).node.context.level2).toEqual('level2');
        expect(comp.find(Level3Component).node.context.level2).toEqual('level2');
        expect(comp.find(Level4Component).node.context.level2).toEqual('level2');
        expect(comp.find(Level5Component).node.context.level2).toEqual('level2');
        
        expect(comp.find(Level3Component).node.context.level3).toEqual('level3');
        expect(comp.find(Level4Component).node.context.level3).toEqual('level3');
        expect(comp.find(Level5Component).node.context.level3).toEqual('level3');
        
        expect(comp.find(Level4Component).node.context.level4).toEqual('level4');
        expect(comp.find(Level5Component).node.context.level4).toEqual('level4');
        
        expect(comp.find(Level5Component).node.context.level5).toEqual('level5');
      })
  })
})