import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import dataLoader from './referenceDataLoader';
import createNew from './createNew';
import NodeOption from '../../Library/NodeOption';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {sanitizeOptions} from '../../Library';
import style from "@neos-project/neos-ui/src/Containers/Drawer/style.module.css";
import {Button} from "@neos-project/react-ui-components";

@connect((state) => ({
    creationDialogIsOpen: state?.ui?.nodeCreationDialog?.isOpen,
    changesInInspector: state?.ui?.inspector?.valuesByNodePath,
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}), {
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
}))
@createNew()
@dataLoader({isMulti: false})
export default class ReferenceEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        className: PropTypes.string,
        options: PropTypes.array,
        searchOptions: PropTypes.array,
        placeholder: PropTypes.string,
        displayLoadingIndicator: PropTypes.bool,
        threshold: PropTypes.number,
        onSearchTermChange: PropTypes.func,
        onCreateNew: PropTypes.func,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        secondaryEditorsRegistry: PropTypes.object.isRequired,
        disabled: PropTypes.bool,
        creationDialogIsOpen: PropTypes.bool,
        changesInInspector: PropTypes.object,
        setActiveContentCanvasSrc: PropTypes.func.isRequired,
        focusedNodeContextPath: PropTypes.string,
        getNodeByContextPath: PropTypes.func.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        node: PropTypes.object,
    };

    handleValueChange = value => {
        this.props.commit(value);
    }

    handleClick = value => {
        const {creationDialogIsOpen, changesInInspector, setActiveContentCanvasSrc} = this.props;

        if (value && setActiveContentCanvasSrc && !creationDialogIsOpen && !Object.keys(changesInInspector).length) {
            setActiveContentCanvasSrc(value);
        }
    }
    handleOpenEdgePropertiesSelector = () => {
        const {secondaryEditorsRegistry, options, value, node, nodeTypesRegistry} = this.props;
        const {component: EdgePropertiesSelector} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/EdgePropertiesSelector');

        const propertyElements = nodeTypesRegistry.getEdgeReferenceConfigurationForProperty(node?.nodeType, this.props.identifier);

        this.props.renderSecondaryInspector('EDGE_PROPERTY_EDITOR', () =>
            <EdgePropertiesSelector node={options[0]} items={propertyElements} handleApply={this.handleEdgePropertiesSelected} />
        );
    }
    handleEdgePropertiesSelected = newEdgeProperties => {
        this.handleValueChange(newEdgeProperties);
    }

    render() {
        const {className, value, i18nRegistry, threshold, options, displayLoadingIndicator, onSearchTermChange, onCreateNew, disabled} = this.props;

        return (<div><SelectBox
            className={className}
            optionValueField="identifier"
            displaySearchBox={true}
            ListPreviewElement={NodeOption}
            createNewLabel={i18nRegistry.translate('Neos.Neos:Main:createNew')}
            noMatchesFoundLabel={i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
            searchBoxLeftToTypeLabel={i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
            placeholder={i18nRegistry.translate(this.props.placeholder)}
            threshold={threshold}
            options={sanitizeOptions(options)}
            value={value}
            onValueChange={this.handleValueChange}
            onHeaderClick={() => this.handleClick(options[0].uri)}
            loadingLabel={i18nRegistry.translate('Neos.Neos:Main:loading')}
            displayLoadingIndicator={displayLoadingIndicator}
            showDropDownToggle={false}
            allowEmpty={true}
            onSearchTermChange={onSearchTermChange}
            onCreateNew={onCreateNew}
            disabled={disabled}
        />
            <Button
                className={style.drawer__menuItemBtn}
                onClick={this.handleOpenEdgePropertiesSelector}
                style="transparent"
                hoverStyle="clean"
            >
                Open Edge Properties
            </Button>
        </div>);
    }
}
