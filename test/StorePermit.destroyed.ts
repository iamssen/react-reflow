import {Store, StorePermit} from '../src';

const createStore = () => new Store({
  state: {
    a: 1,
  }
})

describe('StorePermit.destroyed', () => {
  it('Store 파괴 이전에는 false를 return한다.', () => {
    const store: Store = createStore();
    const permit: StorePermit = store.access();
    expect(store.destroyed).toBeFalsy();
    expect(permit.destroyed).toBeFalsy();
  })
  
  it('Store 파괴 이후에는 true를 return한다.', () => {
    const store: Store = createStore();
    const permit: StorePermit = store.access();
    store.destroy();
    expect(store.destroyed).toBeTruthy();
    expect(permit.destroyed).toBeTruthy();
  })
  
  it('StorePermit 파괴 이후에는 true를 return한다.', () => {
    const store: Store = createStore();
    const permit: StorePermit = store.access();
    permit.destroy();
    expect(store.destroyed).toBeFalsy();
    expect(permit.destroyed).toBeTruthy();
  })
})