import {Observable, Subscription} from 'rxjs';
import {Component, PropTypes, createElement} from 'react';
import {Observe, StorePermit, Store, ActionTools} from './store';

export type Provider = {
  mapState?: (observe: Observe) => Observable<{[name: string]: any}>,
  mapHandlers?: (tools: ActionTools) => {[name: string]: any},
}

export function provide(...providers: Provider[]): (WrappedComponent: any) => any {
  return (WrappedComponent) => {
    class Provided extends Component<any, {drops: any}> {
      static displayName = `Provided(${WrappedComponent.displayName || WrappedComponent.name})`;
      
      private permit: StorePermit;
      private subscription: Subscription;
      private dropHandlers: {[name: string]: any};
      private dropState: {[name: string]: any};
      
      context: {
        reflowStore?: Store,
      }
      
      static contextTypes = {
        reflowStore: PropTypes.object,
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
        this.permit = this.context.reflowStore.access();
        
        const mapState = providers
          .filter(provider => typeof provider.mapState === 'function')
          .map(provider => provider.mapState(this.permit.observe))
          .reverse();
        
        const mapHandler = providers
          .filter(provider => typeof provider.mapHandlers === 'function')
          .map(provider => provider.mapHandlers(this.permit.tools))
          .reverse();
        
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
    }
    
    return Provided;
  };
}