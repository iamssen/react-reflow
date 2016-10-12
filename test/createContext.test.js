import {createContext} from '../src/index';

describe('createContext', () => {
  it('methods should be chain method', () => {
    const context = createContext();
    
    expect(context.reducers({})).toEqual(context);
    expect(context.backgrounds()).toEqual(context);
  });
  
  it('reducers should be a function', () => {
    const context = createContext();
    const fn = (state, action) => {
    }
    
    expect(() => context.reducers({a: 1})).toThrow();
    expect(() => context.reducers({a: 'a'})).toThrow();
    expect(() => context.reducers({a: fn})).not.toThrow();
  });
  
  
})