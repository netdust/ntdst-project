<?php

use \helpers\Html;
use \helpers\Site;
use \helpers\Page;
use \helpers\Location;

function script_tag( ) {
ob_start(); ?>
<script type="text/javascript">
        $(document).ready(function() {
            $("input[type=checkbox], input[type=radio]").checkbox();
            $("select").dropdown();
            $("nav").navigation();
        });
    </script>
    <?php return ob_get_clean();
}

function include_scripts( ) {
    global $app;
    if( $app->getMode() != 'production' ) {
        echo Html::script( Location::js('vendor/jquery.js') );
        echo Html::script( Location::to('../bower_components/formstone/src/js/core.js') );
        echo Html::script( Location::to('../bower_components/formstone/src/js/mediaQuery.js') );
        echo Html::script( Location::to('../bower_components/formstone/src/js/swap.js') );
        echo Html::script( Location::to('../bower_components/formstone/src/js/navigation.js') );
        echo Html::script( Location::to('../bower_components/formstone/src/js/checkbox.js') );
        echo Html::script( Location::to('../bower_components/formstone/src/js/dropdown.js') );
    }
    else {
        echo Html::script( Location::js('build.min.js') );
    }
}

function include_style( ) {
    global $app;
    if( $app->getMode() != 'production' ) {
        echo Html::style( Location::to('http://d2v52k3cl9vedd.cloudfront.net/basscss/7.0.4/basscss.min.css') );
        echo Html::style( Location::to('../bower_components/formstone/dist/css/navigation.css') );
        echo Html::style( Location::to('../bower_components/formstone/dist/css/checkbox.css') );
        echo Html::style( Location::to('../bower_components/formstone/dist/css/dropdown.css') );
        echo Html::style( Location::css('main.css') );
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
    echo script_tag();
});

\helpers\Util::register_shortcode( 'test', function( $prm, $cnt ) {
    return ', ' . $prm['a'] .', '. $prm['b'] ;
});