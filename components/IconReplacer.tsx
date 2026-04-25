import React from 'react';
import { iconMap } from '../constants/iconMap';

interface IconReplacerProps {
  children: React.ReactNode;
  enabled: boolean;
}

const replaceIconsRecursively = (node: React.ReactNode): React.ReactNode => {
    if (!node) {
        return null;
    }

    // Case 1: Node is a string. Check if it's an icon name.
    if (typeof node === 'string') {
        const trimmedNode = node.trim().toLowerCase();
        if (iconMap[trimmedNode]) {
            // Replace the string with the SVG icon component
            return React.cloneElement(iconMap[trimmedNode], { key: trimmedNode });
        }
        return node; // Not an icon name, return as is.
    }
    
    // Case 2: Node is an array of nodes. Process each one.
    if (Array.isArray(node)) {
        return React.Children.map(node, replaceIconsRecursively);
    }

    // Case 3: Node is a valid React element.
    // FIX: Add a specific type assertion for the element's props. This ensures
    // TypeScript knows about the `children` property and allows spreading `node.props`
    // without errors. The previous `<any>` assertion was insufficient.
    if (React.isValidElement<{ children?: React.ReactNode; [key: string]: any }>(node)) {
        // If the element is a custom functional component (e.g., <SimulatedPage />),
        // we need to process what it *renders*.
        // We can do this by calling it as a function to get its output.
        // NOTE: This is a simplified approach for this demo. It won't work correctly
        // for components that rely on React hooks (useState, useEffect, etc.).
        if (typeof node.type === 'function') {
            const Component = node.type as (props: any) => React.ReactElement | null;
            // Avoid errors with class components which can't be called as functions
            if (!Component.prototype?.isReactComponent) {
                const renderedOutput = Component(node.props);
                return replaceIconsRecursively(renderedOutput); // Recurse on the component's output
            }
        }

        // If it's a standard HTML element with children (e.g., <div>), process its children.
        if (node.props.children) {
            const children = React.Children.map(node.props.children, replaceIconsRecursively);
            return React.cloneElement(node, { ...node.props }, children);
        }
    }
    
    // Default: Return the node unchanged.
    return node;
};

const IconReplacer: React.FC<IconReplacerProps> = ({ children, enabled }) => {
    if (!enabled) {
        return <>{children}</>;
    }

    return <>{replaceIconsRecursively(children)}</>;
};

export default IconReplacer;