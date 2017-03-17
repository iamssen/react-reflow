import {mountedStores} from './createContext';
import {getParentStore, getConfig} from './internal';
import {Store} from './store';
import {StoreConfig} from './types';

type StoreNode = {
  state: string[],
  store: Store,
  children?: StoreNode[],
}

function getReflowContext(): {root: StoreNode[], nodes: Map<Store, StoreNode>} {
  const root: StoreNode[] = [];
  const nodes: Map<Store, StoreNode> = new Map<Store, StoreNode>();
  
  mountedStores.forEach(store => {
    const parentStore: Store = store[getParentStore]();
    const config: StoreConfig = store[getConfig]();
    
    const node: StoreNode = {
      store,
      state: Object.keys(config.state),
    }
    
    nodes.set(store, node);
    if (!parentStore) root.push(node);
  })
  
  nodes.forEach((node, store) => {
    const parentStore: Store = store[getParentStore]();
    if (!nodes.has(parentStore)) return;
    const parentNode: StoreNode = nodes.get(parentStore);
    if (!parentNode.children) parentNode.children = [];
    parentNode.children.push(node);
  })
  
  return {root, nodes};
}

type State = {[k: string]: any};

type Print = {
  depth: number,
  state: State,
  toString: () => string,
}

function printReflowState(spacer: string = '   ') {
  const {root, nodes} = getReflowContext();
  const promises: Promise<void>[] = [];
  const loaded: Map<Store, State> = new Map<Store, State>();
  
  nodes.forEach(node => {
    promises.push(
      node.store.observe(...node.state).first().toPromise().then(state => {
        loaded.set(node.store, state);
      })
    );
  })
  
  function printStoreNode(node: StoreNode, depth: number = 0, prints: Print[]) {
    console.log([...Array(depth)].fill(spacer).join(''), loaded.get(node.store))
    if (node.children) node.children.forEach(node => printStoreNode(node, depth + 1, prints));
  }
  
  Promise.all(promises).then(() => {
    const prints: Print[] = [];
    root.forEach(node => printStoreNode(node, 0, prints));
  })
}

window['getReflowContext'] = getReflowContext;
window['printReflowState'] = printReflowState;