import {Component, PropTypes, ReactElement, Children, createElement} from 'react';
import {Store} from './store';
import {StorePermit} from './permit';
import {ContextConfig, Dispatch, Action, Observe, Teardown, GetState} from './types';

const unavailableNames: string[] = ['children', 'parentStore'];
function findUnavailableName(obj): string {
  return unavailableNames.find(name => obj[name] !== undefined);
}

export function createContext(config: ContextConfig): any {
  const name = findUnavailableName(config.state);
  if (typeof name === 'string') throw new Error(`Do not include "${name}" to "state". unavailable names [${unavailableNames.join(', ')}]`);
  
  const isolated: boolean = config.isolate === true;
  const toChildrenContextTypes = {'_REFLOW_CONTEXT_': PropTypes.object};
  const fromParentContextTypes = {};
  
  if (!isolated) {
    toChildrenContextTypes['_REFLOW_PARENT_CONTEXT_'] = PropTypes.object;
    fromParentContextTypes['_REFLOW_PARENT_CONTEXT_'] = PropTypes.object;
  }
  
  class Context extends Component<{parentStore?: Store}, {}> {
    static displayName = `Context({${Object.keys(config.state).join(',')}})`;
    
    private store: Store;
    private permit: StorePermit;
    private unhandleContextProps: Teardown;
    private contextProps: {[name: string]: (prevValue, nextValue) => void};
    
    // to children components
    static childContextTypes = toChildrenContextTypes;
    
    getChildContext() {
      const context = {'_REFLOW_CONTEXT_': this.store};
      if (!isolated) context['_REFLOW_PARENT_CONTEXT_'] = this.store;
      return context;
    };
    
    // from parent component
    context: {
      _REFLOW_CONTEXT_: Store,
      _REFLOW_PARENT_CONTEXT_: Store,
    }
    
    static contextTypes = fromParentContextTypes;
    
    render() {
      // FIXME Allow multiple children elements. However, multiple children are warapped in <div>
      return Children.count(this.props.children) > 1
        ? createElement('div', null, this.props.children) as ReactElement<any>
        : this.props.children as ReactElement<any>;
    }
    
    private receiveProps(prevProps, nextProps) {
      Object.keys(nextProps).forEach(name => {
        if (typeof this.contextProps[name] === 'function' && prevProps[name] !== nextProps[name]) {
          this.contextProps[name](prevProps[name], nextProps[name]);
        }
      });
    }
    
    componentWillMount() {
      // FIXME props를 통해서 parentStore 수동 입력 (다른 frame과 혼합시에 도움이 될듯 싶다)
      this.store = new Store(config, this.props.parentStore || this.context._REFLOW_PARENT_CONTEXT_);
      this.permit = this.store.access();
      
      if (typeof config.handleContextProps === 'function') {
        this.unhandleContextProps = config.handleContextProps(this.permit.tools, this.getContextProps);
      }
      
      if (typeof config.receiveContextProps === 'function') {
        this.contextProps = config.receiveContextProps(this.permit.tools);
        const name = findUnavailableName(config.state);
        if (typeof name === 'string') throw new Error(`Do not include "${name}" to "receiveContextProps". unavailable names [${unavailableNames.join(', ')}]`);
        this.receiveProps({}, this.props);
      }
    }
    
    componentWillReceiveProps(nextProps): void {
      if (this.contextProps) {
        this.receiveProps(this.props, nextProps);
      }
    }
    
    componentWillUnmount() {
      if (typeof this.unhandleContextProps === 'function') this.unhandleContextProps();
      this.unhandleContextProps = null;
      
      this.permit.destroy();
      this.store.destroy();
      this.permit = null;
      this.store = null;
    }
    
    shouldComponentUpdate(nextProps): boolean {
      return this.props.children !== nextProps.children;
    }
    
    private getContextProps = () => {
      return this.props;
    }
    
    // ---------------------------------------------
    // StorePermit API
    // ---------------------------------------------
    hasParent = (): boolean => {
      return this.permit.hasParent();
    }
    
    hasState = (name: string): boolean => {
      return this.permit.hasState(name);
    }
    
    isPlainState = (name: string): boolean => {
      return this.permit.isPlainState(name);
    }
    
    observe: Observe = (...names: string[]) => {
      return this.permit.observe(...names);
    }
    
    getState: GetState = (...names: string[]) => {
      return this.permit.getState(...names);
    }
    
    dispatch: Dispatch = (action: Action) => {
      return this.permit.dispatch(action);
    }
  }
  
  return Context;
}
