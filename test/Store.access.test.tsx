import {Store} from '../src';

const createStore = () => new Store({
  state: {
    a: 1,
  }
})

describe('Store.access()', () => {
  it('Store 파괴 이후에는 null을 return하게 된다.', () => {
    const store = createStore();
    expect(store.destroyed).toBeFalsy();
    expect(store.access()).not.toBeNull();
    
    store.destroy();
    expect(store.destroyed).toBeTruthy();
    expect(store.access()).toBeNull();
  })
  
  it('Store 파괴 이후 StorePermit 역시 destroyed 상태가 되어야 한다.', () => {
    const store = createStore();
    const permit = store.access();
    expect(store.destroyed).toBeFalsy();
    expect(permit.destroyed).toBeFalsy();
    
    store.destroy();
    expect(store.destroyed).toBeTruthy();
    expect(permit.destroyed).toBeTruthy();
  })
})