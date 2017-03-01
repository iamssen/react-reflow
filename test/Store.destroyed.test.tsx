import {Store} from '../src';

const createStore = () => new Store({
  state: {
    a: 1,
  }
})

describe('Store.destroyed', () => {
  it('Store 파괴 이전에는 true를 return한다.', () => {
    const store: Store = createStore();
    expect(store.destroyed).toBeFalsy();
  })
  
  it('Store 파괴 이후에는 false를 return한다.', () => {
    const store: Store = createStore();
    store.destroy();
    expect(store.destroyed).toBeTruthy();
  })
})