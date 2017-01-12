import {Component, PropTypes, ReactElement} from 'react';
import {ContextConfig, Store, StorePermit, Dispatch, Action, Observe} from './store';

const blockNames = ['children', 'parentStore'];

export function createContext(config: ContextConfig): any {
  blockNames.forEach(name => {
    if (config.state[name] !== undefined) {
      throw new Error(`Do not include "${name}" to "state"`);
    }
  })
  
  class Context extends Component<{parentStore?: Store}, {}> {
    private store: Store;
    private permit: StorePermit;
    
    // to children components
    static childContextTypes = {
      parentStore: PropTypes.object,
    };
    
    getChildContext() {
      return {
        parentStore: this.store,
      };
    };
    
    // from parent component
    context: {
      parentStore?: Store,
    }
    
    static contextTypes = {
      parentStore: PropTypes.object,
    };
    
    render() {
      return this.props.children as ReactElement<any>;
    }
    
    propsToUpdate(prevProps, nextProps): {[name: string]: any} {
      const update = {};
      let hasUpdate: boolean = false;
      
      for (const [name, value] of nextProps) {
        if (this.store.isPlainState(name) && prevProps[name] !== nextProps[name]) {
          update[name] = value;
          hasUpdate = true;
        }
      }
      
      return hasUpdate ? update : null;
    }
    
    componentWillMount() {
      // FIXME props를 통해서 parentStore 수동 입력 (다른 frame과 혼합시에 도움이 될듯 싶다)
      this.store = new Store(config, this.context.parentStore || this.props.parentStore);
      this.permit = this.store.access();
      
      const update = this.propsToUpdate({}, this.props);
      if (update) this.permit.dispatch(update);
    }
    
    componentWillReceiveProps(nextProps): void {
      const update = this.propsToUpdate(this.props, nextProps);
      if (update) this.permit.dispatch(update);
    }
    
    componentWillUnmount() {
      this.permit.destroy();
      this.store.destroy();
      this.permit = null;
      this.store = null;
    }
    
    observe: Observe = (...names: string[]) => {
      return this.permit.observe(...names);
    }
    
    dispatch: Dispatch = (action: Action) => {
      return this.permit.dispatch(action);
    }
  }
  
  return Context;
}
