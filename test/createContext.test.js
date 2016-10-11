import {createContext} from '../src/index';
/*
테스트 할 항목들?
- dispatch & action
  - dispatch를 통한 값의 변경이 reducer에 의해 잘 적용되어지는지 확인
  - dispatch thunk style action에 context 값들이 잘 들어오는지 확인
- enterParent
  - context 값들이 잘 들어오는지 확인
  - 상위의 dispatch가 잘 작동하는지 확인
- contextTypes (injection)
  - 모든 선언된 값들이 잘 들어오는지 확인
- initialState
  - 기본값들이 잘 적용되어 들어갔는지 확인
*/

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