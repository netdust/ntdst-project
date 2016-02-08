<?php

include_once( dirname(__FILE__) . '/admin/system/bootstrap.php');

require( dirname(__FILE__). '/admin/system/api/Routes/Admin.php');
require( dirname(__FILE__). '/admin/system/api/Routes/Api.php');

$app->add(new \api\Middleware\I18n(array(
    'fr' => 'Français',
    'nl' => 'Nederlands'
)));


# -----------------------------------------------

$iscms = (bool)preg_match('|/cms.*$|', $_SERVER['REQUEST_URI']);
$isapi = (bool)preg_match('|/api/v.*$|', $_SERVER['REQUEST_URI']);
if (!$iscms && !$isapi) {
    $app->get('/(:slug+)', function ($slug = '') use ($app) {
        if( $app->page == null ) $app->notFound();
        else render(locate_template()); 
    });
}

$app->run();