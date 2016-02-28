<?php

use \helpers\Html;
use \helpers\Site;
use \helpers\Page;
use \helpers\Location;

function include_scripts( ) {
    global $app;
    if( $app->getMode() != 'production' ) {

        echo Html::script( Location::to('bower_components/jquery/dist/jquery.js') );
        echo Html::script( Location::to('bower_components/formstone/src/js/core.js') );
        echo Html::script( Location::to('bower_components/formstone/src/js/swap.js') );
        echo Html::script( Location::to('bower_components/formstone/src/js/touch.js') );
        echo Html::script( Location::to('bower_components/formstone/src/js/carousel.js') );
        echo Html::script( Location::to('bower_components/formstone/src/js/transition.js') );
        echo Html::script( Location::to('bower_components/formstone/src/js/mediaQuery.js') );
        echo Html::script( Location::to('bower_components/formstone/src/js/navigation.js') );
        echo Html::script( Location::to('bower_components/formstone/src/js/background.js') );
        //echo Html::script( Location::to('bower_components/formstone/src/js/checkbox.js') );
        //echo Html::script( Location::to('bower_components/formstone/src/js/dropdown.js') );
        echo Html::script( Location::js('components/validate.js') );
        echo Html::script( Location::js('components/sticky.js') );

        echo Html::script( Location::js('application-build.js') );
    }
    else {
        echo Html::script( Location::js('build.min.js') );
    }
}

function include_style( ) {
    global $app;
    if( $app->getMode() != 'production' ) {
        echo Html::style( Location::css('build.css') );
        echo Html::style( Location::to('bower_components/components-font-awesome/css/font-awesome.css') );
        echo Html::style( Location::to('bower_components/formstone/dist/css/background.css') );
        echo Html::style( Location::to('bower_components/formstone/dist/css/navigation.css') );
        echo Html::style( Location::to('bower_components/formstone/dist/css/carousel.css') );
        //echo Html::style( Location::to('bower_components/formstone/dist/css/checkbox.css') );
        //echo Html::style( Location::to('bower_components/formstone/dist/css/dropdown.css') );
    }
    else {
        echo Html::style( Location::css('build.min.css') );
    }
}

$app->hook('header', function() {
    echo include_style();
});

$app->hook('script', function() use ( $app ) {
    echo include_scripts( );
});

\helpers\Util::register_shortcode( 'test', function( $prm, $cnt ) {
    return ', ' . $prm['a'] .', '. $prm['b'] ;
});