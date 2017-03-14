/// <reference types="react" />
import * as React from 'react';
export declare class ContextLinker extends React.Component<{}, {}> {
    static contextTypes: {
        _REFLOW_CONTEXT_: React.Requireable<any>;
        _REFLOW_PARENT_CONTEXT_: React.Requireable<any>;
    };
    render(): any;
    renderComponent: (component: JSX.Element, container: Element) => () => void;
}
