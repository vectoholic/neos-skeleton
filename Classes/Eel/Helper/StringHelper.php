<?php

namespace Vectoholic\Site\Eel\Helper;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;

class StringHelper implements ProtectedContextAwareInterface {

    /**
   * Translates a camel case string into a string with hyphen (e.g. camelCase -&gt; camel-case)
   * @param  string $str String in camel case format
   * @return string $str Translated into underscore format
   */
  function toKebabCase(string $str) {
      $str = preg_replace('/[^A-Za-z0-9\-]/', '', $str);
      $str[0] = strtolower($str[0]);
      $func = create_function('$c', 'return "-" . strtolower($c[1]);');
      return preg_replace_callback('/([A-Z])/', $func, $str);
  }

    /**
     * All methods are considered safe, i.e. can be executed from within Eel
     *
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName) {
        return TRUE;
    }

}
