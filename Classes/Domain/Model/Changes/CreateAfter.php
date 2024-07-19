<?php
declare(strict_types=1);
namespace Neos\Neos\Ui\Domain\Model\Changes;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class CreateAfter extends AbstractCreate
{
    /**
     * Get the insertion mode (before|after|into) that is represented by this change
     */
    public function getMode(): string
    {
        return 'after';
    }

    /**
     * Check if the new node's node type is allowed in the requested position
     */
    public function canApply(): bool
    {
        $parent = $this->findParentNode($this->subject);
        $nodeTypeName = $this->getNodeTypeName();

        return $parent && $nodeTypeName && $this->isNodeTypeAllowedAsChildNode($parent, $nodeTypeName);
    }

    /**
     * Create a new node after the subject
     */
    public function apply(): void
    {
        $parentNode = $this->findParentNode($this->subject);
        $subject = $this->subject;
        if ($this->canApply() && !is_null($parentNode)) {
            $succeedingSibling = null;
            try {
                $succeedingSibling = $this->findChildNodes($parentNode)->next($subject);
            } catch (\InvalidArgumentException $e) {
                // do nothing; $succeedingSibling is null.
            }

            $this->createNode($parentNode, $succeedingSibling?->aggregateId);

            $this->updateWorkspaceInfo();
        }
    }
}
