/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';
// @ts-ignore

import {I18nRegistry, NodeTypesRegistry} from '@neos-project/neos-ts-interfaces';

import style from './style.module.css';
import I18n from '@neos-project/neos-ui-i18n';
import {Button} from '@neos-project/react-ui-components';

type EdgePropertiesSelectorHandlers = {
    confirm: () => void;
    cancel: () => void;
    items: object;
    node: object;
    commit: () => void;
    handleApply: () => void;
};

type EdgePropertiesPropsFromNeosGlobals = {
    i18nRegistry: I18nRegistry;
    nodeTypesRegistry: null | NodeTypesRegistry
}

type WorkspaceSyncProps =
& EdgePropertiesPropsFromNeosGlobals
& EdgePropertiesSelectorHandlers;

const EdgePropertiesSelector: React.FC<WorkspaceSyncProps> = (props) => {
    const {handleApply, node, commit, items} = props;
    console.log(items);
    const handleClick = React.useCallback(() => {
        handleApply();
    }, []);
    console.log(items);
    return (
        <div id="neos-edgeProperties" className={style.wrapper}>
            <Button
                id="neos-edgeProperties-Cancel"
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={handleClick}
            >
                <I18n
                    id="Neos.Neos.Ui:EdgePropertySelector:confirmation.cancel"
                    fallback="save"
                />
            </Button>
            {items.map(item => {
                const itemId = item?.id;
                const itemType = item?.type;
                const label = item?.label || '';

                if (itemType === 'editor') {
                    return (
                        <EditorComponent
                            key={node?.contextPath + itemId}
                            id={itemId}
                            label={label}
                            editor={item?.editor}
                            options={item?.editorOptions}
                            renderSecondaryInspector={renderSecondaryInspector}
                            node={node}
                            commit={commit}
                            onEnterKey={handleClick}
                            helpMessage={item?.helpMessage}
                            helpThumbnail={item?.helpThumbnail}
                        />);
                }
                if (itemType === 'view') {
                    return (
                        <InspectorViewEnvelope
                            key={node?.contextPath + itemId}
                            id={itemId}
                            label={item?.label}
                            view={item?.view}
                            options={item?.viewOptions}
                            renderSecondaryInspector={renderSecondaryInspector}
                            node={node}
                            commit={commit}
                        />);
                }
                return null;
            })}
        </div>
    );
};

export default EdgePropertiesSelector as any;
