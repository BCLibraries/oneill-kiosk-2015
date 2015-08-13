<?php

$path = $argv[1];

$xml = simplexml_load_file($path);

$xml->registerXPathNamespace('svg', 'http://www.w3.org/2000/svg');
$computers = $xml->xpath('//svg:g[@class="computer"]');

foreach ($computers as $computer) {
    $coords = parse_d($computer->path["d"]);
    $x = $coords[1] - 18;
    $y = $coords[2] - 14;
    $translate = "translate(" . $x . "," . $coords[2] - 14 . ")";
    $translate = "translate($x,$y)";
    $computer->addAttribute('transform', $translate);

    unset($computer->path);

    $use = $computer->addChild('use');
    $use->addAttribute('xlink:href', '#comp-group', 'http://www.w3.org/1999/xlink');
}

echo $xml->asXML();

function parse_d($d)
{
    $regex = '/^M(\d+)\.?\d*,(\d+)/';
    $matches = [];
    preg_match($regex, $d, $matches);
    return $matches;
}