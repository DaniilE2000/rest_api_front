<?php

$uri = trim($_SERVER['REQUEST_URI'], '/');

$pathinfo = pathinfo($uri);
$extension = isset($pathinfo['extension']) ? $pathinfo['extension'] : null;
if(isset($extension) && in_array($extension, ['js', 'css'])) {
    loadPage('./public/' . $extension . '/' . $pathinfo['basename']);
    exit();
}

$path = \explode('/', $uri)[0];

function loadPage(string $pagePath): void
{
    echo \file_get_contents($pagePath);
}

switch($path) {
    case '': // fallthrough
    case 'generate':
        loadPage('./public/generate.html');
        break;
    case 'get':
        loadPage('./public/get.html');
        break;
    default:
        echo 'not found';
        break;
}

?>