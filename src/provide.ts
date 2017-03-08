import {Observable, Subscription} from 'rxjs';
import {Component, PropTypes, createElement} from 'react';
import {Store} from './store';
import {StorePermit} from './permit';
import {Provider} from './types';

export function provide(...providers: Provider[]): (WrappedComponent: any) => any {
  // TODO Support deprecated provide api. This is going to remove in 0.6
  if (typeof providers[0] === 'function' || typeof providers[1] === 'function') {
    const legacyProvider: any = {};
    if (typeof providers[0] === 'function') legacyProvider.mapState = providers[0];
    if (typeof providers[1] === 'function') legacyProvider.mapHandlers = providers[1];
    
    providers = [legacyProvider];
  }
  
  return (WrappedComponent) => {
    class Provided extends Component<any, {drops: any}> {
      static displayName = `Provided(${WrappedComponent.displayName || WrappedComponent.name})`;
      
      private permit: StorePermit;
      private subscription: Subscription;
      private dropHandlers: {[name: string]: any};
      private dropState: {[name: string]: any};
      
      context: {
        _REFLOW_CONTEXT_?: Store,
      }
      
      static contextTypes = {
        _REFLOW_CONTEXT_: PropTypes.object,
      }
      
      state = {
        drops: null,
      }
      
      render() {
        return this.state.drops && this.dropState
          ? createElement(WrappedComponent, this.state.drops)
          : null;
      }
      
      updateDrops(props) {
        this.setState({
          drops: Object.assign({}, props, this.dropState, this.dropHandlers)
        });
      }
      
      componentWillMount() {
        this.permit = this.context._REFLOW_CONTEXT_.access();
        
        const mapState = providers
          .filter(provider => typeof provider.mapState === 'function')
          .map(provider => provider.mapState(this.permit.observe));
        
        const mapHandler = providers
          .filter(provider => typeof provider.mapHandlers === 'function')
          .map(provider => provider.mapHandlers(this.permit.tools));
        
        this.dropHandlers = Object.assign({}, ...mapHandler);
        
        this.subscription = mapState.length > 0
          ? Observable.combineLatest(...mapState)
            .map(states => Object.assign({}, ...states))
            .subscribe(state => {
              this.dropState = state;
              this.updateDrops(this.props);
            })
          : null;
      }
      
      componentWillReceiveProps(nextProps: any) {
        this.updateDrops(nextProps);
      }
      
      componentWillUnmount() {
        if (this.subscription) this.subscription.unsubscribe();
        this.permit.destroy();
        
        this.subscription = null;
        this.permit = null;
        
        this.dropHandlers = null;
        this.dropState = null;
      }
      
      shouldComponentUpdate(nextProps, nextState): boolean {
        return this.state.drops !== nextState.drops;
      }
    }
    
    return Provided;
  };
}