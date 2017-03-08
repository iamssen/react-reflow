import {Store} from '../src';

const createStore = () => {
  return new Store({
    state: {
      a: 1,
      b: 2,
      c: observe => observe('a', 'b').map(({a, b}) => a + b),
    }
  })
}

describe('getState', () => {
  
  it('값을 정상적으로 읽는다', () => {
    const store = createStore();
    const permit = store.access();
    
    return permit.getState('a', 'b', 'c').then(({a, b, c}) => {
      expect(a).toEqual(1);
      expect(b).toEqual(2);
      expect(c).toEqual(3);
    })
  })
  
  it('값의 변경이 잘 반영된다', () => {
    const store = createStore();
    const permit = store.access();
    
    permit.dispatch({a: 10, b: 20});
    
    return permit.getState('a', 'b', 'c').then(({a, b, c}) => {
      expect(a).toEqual(10);
      expect(b).toEqual(20);
      expect(c).toEqual(30);
    })
  })
  
  it('getState() 이후 Store가 파괴되어도 잘 가져올 수 밖에 없나?????', () => {
    const store = createStore();
    const permit = store.access();
    
    permit.getState('a').then(({a}) => {
      expect(a).toEqual(1);
    })
    
    store.destroy();
  })
  
  it('Store 파괴 이후엔 무시하되, console.error()로 알린다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    
    store.destroy();
    permit.getState('a').then(() => {
    });
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('StorePermit 파괴 이후엔 무시하되, console.error()로 알린다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    
    permit.destroy();
    permit.getState('a').then(() => {
    });
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
})