<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Infrastructure\MVC;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Neos\Ui\Domain\InitialData\RoutesProviderInterface;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class RoutesProvider implements RoutesProviderInterface
{
    public function getRoutes(UriBuilder $uriBuilder): array
    {
        $helper = new RoutesProviderHelper($uriBuilder);
        $routes = [];

        $routes['ui']['service'] = [
            'change' =>
                $helper->buildUiServiceRoute('change'),
            'publishChangesInSite' =>
                $helper->buildUiServiceRoute('publishChangesInSite'),
            'publishChangesInDocument' =>
                $helper->buildUiServiceRoute('publishChangesInDocument'),
            'discardAllChanges' =>
                $helper->buildUiServiceRoute('discardAllChanges'),
            'discardChangesInSite' =>
                $helper->buildUiServiceRoute('discardChangesInSite'),
            'discardChangesInDocument' =>
                $helper->buildUiServiceRoute('discardChangesInDocument'),
            'changeBaseWorkspace' =>
                $helper->buildUiServiceRoute('changeBaseWorkspace'),
            'syncWorkspace' =>
                $helper->buildUiServiceRoute('syncWorkspace'),
            'copyNodes' =>
                $helper->buildUiServiceRoute('copyNodes'),
            'cutNodes' =>
                $helper->buildUiServiceRoute('cutNodes'),
            'clearClipboard' =>
                $helper->buildUiServiceRoute('clearClipboard'),
            'flowQuery' =>
                $helper->buildUiServiceRoute('flowQuery'),
            'generateUriPathSegment' =>
                $helper->buildUiServiceRoute('generateUriPathSegment'),
            'getWorkspaceInfo' =>
                $helper->buildUiServiceRoute('getWorkspaceInfo'),
            'getAdditionalNodeMetadata' =>
                $helper->buildUiServiceRoute('getAdditionalNodeMetadata'),
            'reloadNodes' =>
                $helper->buildUiServiceRoute('reloadNodes'),
        ];

        $routes['core']['content'] = [
            'imageWithMetadata' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Content',
                    actionName: 'imageWithMetaData'
                ),
            'createImageVariant' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Content',
                    actionName: 'createImageVariant'
                ),
            'uploadAsset' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Content',
                    actionName: 'uploadAsset'
                ),
        ];

        $routes['core']['service'] = [
            'assetProxies' =>
                $helper->buildCoreRoute(
                    controllerName: 'Service\\AssetProxies',
                    actionName: 'index'
                ),
            'assets' =>
                $helper->buildCoreRoute(
                    controllerName: 'Service\\Assets',
                    actionName: 'index'
                ),
            'nodes' =>
                $helper->buildCoreRoute(
                    controllerName: 'Service\\Nodes',
                    actionName: 'index'
                ),
            'userPreferences' =>
                $helper->buildCoreRoute(
                    subPackageKey: 'Service',
                    controllerName: 'UserPreference',
                    actionName: 'index',
                    format: 'json',
                ),
            'dataSource' =>
                $helper->buildCoreRoute(
                    subPackageKey: 'Service',
                    controllerName: 'DataSource',
                    actionName: 'index',
                    format: 'json',
                ),
            'contentDimensions' =>
                $helper->buildCoreRoute(
                    controllerName: 'Service\\ContentDimensions',
                    actionName: 'index',
                ),
            'impersonateStatus' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Impersonate',
                    actionName: 'status',
                    format: 'json',
                ),
            'impersonateRestore' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Impersonate',
                    actionName: 'restoreWithResponse',
                    format: 'json',
                ),
        ];

        $routes['core']['modules'] = [
            'workspace' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Module',
                    actionName: 'index',
                    arguments: [
                        'module' => 'management/workspace'
                    ]
                ),
            'userSettings' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Module',
                    actionName: 'index',
                    arguments: [
                        'module' => 'user/usersettings'
                    ]
                ),
            'mediaBrowser' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Module',
                    actionName: 'index',
                    arguments: [
                        'module' => 'media/browser'
                    ]
                ),
            'defaultModule' =>
                $helper->buildCoreRoute(
                    controllerName: 'Backend\\Backend',
                    actionName: 'index',
                ),
        ];

        $routes['core']['login'] =
            $helper->buildCoreRoute(
                controllerName: 'Login',
                actionName: 'index',
                format: 'json',
            );

        $routes['core']['logout'] =
            $helper->buildCoreRoute(
                controllerName: 'Login',
                actionName: 'logout',
            );

        return $routes;
    }
}
