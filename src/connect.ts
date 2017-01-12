import {Observable, Subscription} from 'rxjs';
import {Component, PropTypes, cloneElement, ReactElement} from 'react';
import {Observe, StorePermit, Store} from './store';

export function connect(operator?: (observe: Observe) => Observable<{[name: string]: any}>): any {
  class Connector extends Component<{}, {drops: any}> {
    private permit: StorePermit;
    private subscription: Subscription;
    
    context: {
      parentStore?: Store,
    }
    
    static contextTypes = {
      parentStore: PropTypes.object,
    };
    
    state = {
      drops: {},
    }
    
    render() {
      return cloneElement(this.props.children as ReactElement<any>, this.state.drops);
    }
    
    componentWillMount() {
      this.permit = this.context.parentStore.access();
      
      if (typeof operator === 'function') {
        this.subscription = operator(this.permit.observe).subscribe(state => {
          this.setState({
            drops: Object.assign({dispatch: this.permit.dispatch}, this.state.drops, state),
          });
        });
      } else {
        this.setState({
          drops: {dispatch: this.permit.dispatch},
        });
      }
    }
    
    componentWillUnmount() {
      if (this.subscription) this.subscription.unsubscribe();
      this.permit.destroy();
      
      this.subscription = null;
      this.permit = null;
    }
  }
  
  return Connector;
}