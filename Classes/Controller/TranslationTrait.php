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

namespace Neos\Neos\Ui\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\Translator;

/**
 * A trait to do easy backend module translations
 * @internal
 */
trait TranslationTrait
{
    #[Flow\Inject]
    protected Translator $translator;

    /**
     * @param array<int|string,mixed> $arguments
     */
    public function getLabel(string $id, array $arguments = [], ?int $quantity = null): string
    {
        return $this->translator->translateById(
            $id,
            $arguments,
            $quantity,
            null,
            'Main',
            'Neos.Neos.Ui'
        ) ?: $id;
    }
}
