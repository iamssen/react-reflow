import {Store} from '../src';

const createStore = () => new Store({
  state: {
    a: 1,
  }
})

describe('Store.destroy()', () => {
  it('destroy()가 여러번 실행되는 것을 무시하되, console.error()로 알려준다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store: Store = createStore();
    store.destroy();
    store.destroy();
    
    expect(store.destroyed).toBeTruthy();
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
})