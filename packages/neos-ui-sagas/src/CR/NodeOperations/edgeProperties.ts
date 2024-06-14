/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {put, call, takeEvery, race, take, select} from 'redux-saga/effects';

import {DimensionCombination, WorkspaceName} from '@neos-project/neos-ts-interfaces';
import {AnyError} from '@neos-project/neos-ui-error';
import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
import {PublishingMode, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {Conflict, ResolutionStrategy} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';
import {WorkspaceInformation} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';
import {Routes} from '@neos-project/neos-ui-backend-connector/src/Endpoints';

import {makeReloadNodes} from '../CR/NodeOperations/reloadNodes';

const handleWindowBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = true;
    return true;
};

type SyncWorkspaceResult =
    | { success: true }
    | { conflicts: Conflict[] }
    | { error: AnyError };

export function * watchEdgeProperties({routes}: {routes: Routes}) {
    const syncPersonalWorkspace = makeSyncPersonalWorkspace({routes});

    yield takeEvery(actionTypes.CR.Nodes.START_EDGE_PROPERTIES, function * sync() {
        if (yield * waitForConfirmation()) {
            do {
                yield * syncPersonalWorkspace(false);
            } while (yield * waitForRetry());

            yield put(actions.CR.Syncing.finish());
        }
    });
}

function * waitForConfirmation() {
    const {confirmed}: {
        cancelled: null | ReturnType<typeof actions.CR.Syncing.cancel>;
        confirmed: null | ReturnType<typeof actions.CR.Syncing.confirm>;
    } = yield race({
        cancelled: take(actionTypes.CR.Syncing.CANCELLED),
        confirmed: take(actionTypes.CR.Syncing.CONFIRMED)
    });

    return Boolean(confirmed);
}

