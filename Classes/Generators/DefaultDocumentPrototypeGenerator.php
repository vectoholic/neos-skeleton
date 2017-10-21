<?php
namespace Vectoholic\Site\Generators;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\DefaultPrototypeGeneratorInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
/**
 * @Flow\Scope("singleton")
 */
class DefaultDocumentPrototypeGenerator implements DefaultPrototypeGeneratorInterface
{
    /**
     * Generate a Fusion prototype definition for a given node type
     *
     * @param NodeType $nodeType
     * @return string
     */
    public function generate(NodeType $nodeType)
    {
        if (strpos($nodeType->getName(), ':') === false) {
            return '';
        }
        $prototypeName = $nodeType->getName();
        $output = 'prototype(' . $prototypeName . ') < prototype(Vectoholic.Site:Template) {' . chr(10);
        foreach ($nodeType->getProperties() as $propertyName => $propertyConfiguration) {
            if (isset($propertyName[0]) && $propertyName[0] !== '_') {
                $autoTag = (isset($propertyConfiguration['autoTag'])) ? $propertyConfiguration['autoTag'] : true;
                if (isset($propertyConfiguration['type']) && isset($propertyConfiguration['ui']['inlineEditable']) && $propertyConfiguration['type'] === 'string' && $propertyConfiguration['ui']['inlineEditable'] === true && $autoTag !== false) {
                    $output .= "\t" . $propertyName . ' = Vectoholic.Site:InlineTag {' . chr(10);
                    $output .= "\t" . 'property = "' . $propertyName . '"' . chr(10);
                    $output .= "\t" . '}' . chr(10);
                } else {
                    $output .= "\t" . $propertyName . ' = ${q(node).property("' . $propertyName . '")}' . chr(10);
                }
            }
        }
        $output .= '@process.contentElementWrapping = ContentElementWrapping' . chr(10);
        $output .= '}' . chr(10);
        $output .= 'prototype(' . $prototypeName . '.Document) < prototype(Vectoholic.Site:AbstractPage) {' . chr(10);
        $output .= 'body = ' . $prototypeName . chr(10);
        $output .= '}' . chr(10);
        return $output;
    }
}
