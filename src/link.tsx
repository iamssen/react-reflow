import * as React from 'react';
import * as ReactDOM from 'react-dom';

type Props = {
  context: Object,
  parentContext: Object,
}

class ContextReceiver extends React.Component<Props, {}> {
  static childContextTypes = {
    _REFLOW_CONTEXT_: React.PropTypes.object,
    _REFLOW_PARENT_CONTEXT_: React.PropTypes.object,
  };
  
  getChildContext() {
    return {
      _REFLOW_CONTEXT_: this.props.context,
      _REFLOW_PARENT_CONTEXT_: this.props.parentContext,
    };
  };
  
  render() {
    return this.props.children as JSX.Element;
  }
  
  shouldComponentUpdate(nextProps: Props): boolean {
    return this.props.context !== nextProps.context
      || this.props.parentContext !== nextProps.parentContext;
  }
}

export class ContextLinker extends React.Component<{}, {}> {
  static contextTypes = {
    _REFLOW_CONTEXT_: React.PropTypes.object,
    _REFLOW_PARENT_CONTEXT_: React.PropTypes.object,
  };
  
  render() {
    return null;
  }
  
  renderComponent = (component: JSX.Element, container: Element) => {
    ReactDOM.render((
      <ContextReceiver context={this.context._REFLOW_CONTEXT_}
                       parentContext={this.context._REFLOW_PARENT_CONTEXT_}>
        {component}
      </ContextReceiver>
    ), container);
    
    return () => {
      ReactDOM.unmountComponentAtNode(container);
      container.parentElement.removeChild(container);
    }
  }
}