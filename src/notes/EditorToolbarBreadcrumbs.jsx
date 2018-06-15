import React from 'react'
import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.min.css';
import './EditorToolbar.css';
import './EditorToolbarBreadcrumbs.css';

class EditorToolbarBreadcrumbs extends React.Component {

    renderActiveContexst = (activeContexts) => {
        if (activeContexts.length === 0) {
            return null;
        }
        else {
            const contextOptions = activeContexts.reverse().map((context, i) => {
                const index = activeContexts.length - (i + 1);
                const breadcrumb = context.text.replace("#", "");
                
                return (
                    <div 
                        className="toolbar-breadcrumbs"
                        key={`context-options-item-${index}`}
                    >
                        <div className="breadcrumb-separator"> | </div> 
                        <div className="toolbar-breadcrumb"> {breadcrumb} </div>
                    </div>
                )
            })
            return (
                <div>
                    {contextOptions}
                </div>
            )
        }
    }

    render = () => {
        const activeContexts = this.props.contextManager.getActiveContexts();

        return (
            <div className="toolbar-breadcrumbs-container">
                {this.renderActiveContexst(activeContexts)}
            </div>
        )
    }

}

EditorToolbarBreadcrumbs.proptypes = { 
    contextManager: PropTypes.object.isRequired,
};


export default EditorToolbarBreadcrumbs;
