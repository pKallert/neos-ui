<?php
namespace Neos\Neos\Ui\Domain\Model;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindClosestNodeFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\NodeCreated;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;

/**
 * @internal
 */
abstract class AbstractChange implements ChangeInterface
{
    protected Node $subject;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    /**
     * @Flow\Inject
     * @var FeedbackCollection
     */
    protected $feedbackCollection;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    final public function setSubject(Node $subject): void
    {
        $this->subject = $subject;
    }

    final public function getSubject(): Node
    {
        return $this->subject;
    }

    /**
     * Helper method to inform the client, that new workspace information is available
     */
    final protected function updateWorkspaceInfo(): void
    {
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($this->subject);
        $documentNode = $subgraph->findClosestNode($this->subject->aggregateId, FindClosestNodeFilter::create(nodeTypes: NodeTypeNameFactory::NAME_DOCUMENT));
        if (!is_null($documentNode)) {
            $updateWorkspaceInfo = new UpdateWorkspaceInfo($documentNode->contentRepositoryId, $documentNode->workspaceName);
            $this->feedbackCollection->add($updateWorkspaceInfo);
        }
    }

    final protected function findParentNode(Node $node): ?Node
    {
        return $this->contentRepositoryRegistry->subgraphForNode($node)
            ->findParentNode($node->aggregateId);
    }

    final protected function getNodeType(Node $node): ?NodeType
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->contentRepositoryId);
        return $contentRepository->getNodeTypeManager()->getNodeType($node->nodeTypeName);
    }

    /**
     * Inform the client to reload the currently-displayed document, because the rendering has changed.
     *
     * This method will be triggered if [nodeType].properties.[propertyName].ui.reloadIfChanged is TRUE.
     */
    protected function reloadDocument(Node $node = null): void
    {
        $reloadDocument = new ReloadDocument();
        if ($node) {
            $reloadDocument->setNode($node);
        }

        $this->feedbackCollection->add($reloadDocument);
    }

    /**
     * Inform the client that a node has been created, the client decides if and which tree should react to this change.
     */
    final protected function addNodeCreatedFeedback(Node $subject = null): void
    {
        $node = $subject ?? $this->getSubject();
        $nodeCreated = new NodeCreated();
        $nodeCreated->setNode($node);
        $this->feedbackCollection->add($nodeCreated);
    }
}
