import {Observable, Subscription} from 'rxjs';
import {Component, PropTypes, cloneElement, ReactElement, createElement} from 'react';
import {Observe, StorePermit, Store, ActionTools} from './store';

export function provide(mapState: (observe: Observe) => Observable<{[name: string]: any}>,
                        mapHandlers?: (tools: ActionTools) => {[name: string]: any}): (WrappedComponent: any) => any {
  return (WrappedComponent) => {
    class Provided extends Component<any, {drops: any}> {
      static displayName = `Provided(${WrappedComponent.displayName})`;
      
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
          ? cloneElement(this.props.children as ReactElement<any>, this.state.drops)
          : null;
      }
      
      updateDrops(props) {
        this.setState({
          drops: Object.assign({}, props, this.dropState, this.dropHandlers)
        });
      }
      
      componentWillMount() {
        this.permit = this.context.reflowStore.access();
        this.dropHandlers = (typeof mapHandlers === 'function')
          ? mapHandlers(this.permit.tools)
          : {};
        
        if (typeof mapState !== 'function') throw new Error('...');
        
        this.subscription = mapState(this.permit.observe).subscribe(state => {
          this.dropState = state;
          this.updateDrops(this.props);
        });
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
    
    // return Stateless Component
    return (props) => {
      return createElement(Provided, props, createElement(WrappedComponent));
    }
  }
}