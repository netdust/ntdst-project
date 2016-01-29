<?php

namespace plugins\forms;
use Slim\Slim;


class Plugin extends \Slim\Middleware {

    protected $settings;

    function __construct( $config ) {
        $this->settings = $config;

        $this->addShortCodes();
        $this->addRoutes();
    }


    public function call()
    {
        $app = Slim::getInstance();

        // make them available for other classes */
        $this->app->container->singleton(__NAMESPACE__, function () {
            return $this;
        });


        // call before admin renders
        $app->hook('admin.before.render', function ( $args ) use ($app) {
            $this->render( $args );
        });

        // call when frontend header renders */
        $app->hook('header', function(  ){
            $app = $this->app;
            $plugin = $app->container->get(__NAMESPACE__);
            return function () use ( $app, $plugin )
            {
                // add css
                // add js
            };
        });



        $this->next->call();
    }

    /**
     * init routes
     */
    protected function addRoutes() {
        $app = Slim::getInstance();

        // frontend
        $app->post('/form/:form', array(&$this, 'actionHandleForm'))
            ->name('form');

        // backend
        $app->get('/api/v1/forms', array(&$this, 'actionGetForms'))
            ->name('get_forms');

        $app->get('/api/v1/form/:id', array(&$this, 'actionGetForm'))
            ->name('get_forms');
    }

    public function actionGetForm( $id )
    {
        $form = \Model::factory('Page')->where('id', $id)->find_one();
        $arr = $form->as_array();
        $arr['page_translation'] = $form->translations()->find_one()->as_array();
        $arr['page_meta'] = array_map( function( $meta ) {
            $meta_arr = $meta->as_array();
            $meta_arr['page_meta_translation'] = $meta->translations()->find_array();
            return $meta_arr;
        }, $form->metas()->find_many() );
        $this->app->render( 200, $arr );
    }

    public function actionGetForms( )
    {
        $query = \Model::factory('Page')->where('type', 'form');
        $this->app->render( 200, $query->find_array() );
    }


    public function actionHandleForm( $form ) {
        $app = Slim::getInstance();
        $request = (array) $app->request()->params();

        // do check on some values ( eg name, email, dates, etc... )

        $app->applyHook( 'formHandler', array ( 'form'=>$form, 'request'=>$request) );
    }


    /**
     * init shortcodes
     */
    protected function addShortCodes( ){

        $handle_args = function( $arg, $cb ) {
            $id = isset( $arg['id'] ) ? $arg['id']  : (isset( $arg['name'] ) ? $arg['name']  : '');
            $label = isset( $arg['label'] ) ? $arg['label']  : '';
            $value = isset( $arg['value'] ) ? $arg['value']  : '';
            $required = isset( $arg['required'] ) ? $arg['required']  : false;

            if( isset( $arg['label'] ) ) unset( $arg['label'] );
            return $cb( $id, $label, $value, $required, $arg );
        };

        shortcode( 'submit', function($arg)  {
            $arg['type'] = 'submit';
            $arg['class'] = 'button ' . ( isset( $arg['class'] ) ? $arg['class']  : '' );
            return \helpers\html::input( '', $arg );
        });
        shortcode( 'button', function($arg)  {
            $arg['type'] = 'button';
            return \helpers\html::input( '', $arg );
        });
        shortcode( 'label', function($arg) use ( $handle_args )  {
            return $handle_args($arg, function($id, $label, $value, $required, $arg) {
                return '<label for="'.$id.'">'.$label. ( $required && $label!='' ? " *":"" ).'</label>';
            } );
        });
        shortcode( 'text', function($arg) use ( $handle_args )  {
            $arg['type'] = isset( $arg['type'] ) ? $arg['type']  : 'text';
            return $handle_args($arg, function($id, $label, $value, $required, $arg) {
                $el ='';
                $el .= '<p class="ui">';
                $el .= '    <label for="'.$id.'">'.$label. ( $required && $label!=''? " *":"" ).'</label>';
                $el .= \helpers\html::input( $value, $arg );
                $el .= '</p>';
                return $el;
            } );
        });
        shortcode( 'select', function($arg) use( $handle_args )  {
            $options = explode( ',', $arg['options'] );
            array_walk($options, function (&$v, $k) { $v = '<option>'.$v.'</option>'; });
            return $handle_args($arg, function($id, $label, $value, $required, $arg) use ( $options ) {
                $el ='';
                $el .= '<p class="ui">';
                $el .= '    <label for="'.$id.'">'.$label. ( $required && $label!='' ? " *":"" ).'</label>';
                $el .= '    <select name="'.$id.'" id="'.$id.'" required="'.$required.'">'. implode( $options ).'</select>';
                $el .= '</p>';
                return $el;
            } );
        });
        shortcode( 'radio', function($arg) use ( $handle_args )  {
            $arg['type'] = 'radio';
            return $handle_args($arg, function($id, $label, $value, $required, $arg) {
                $el ='';
                $el .= '<p class="ui radio">';
                $el .= \helpers\html::input( $value, $arg );
                $el .= '    <label for="'.$id.'">'.$label.'</label>';
                $el .= '</p>';
                return $el;
            } );
        });
        shortcode( 'checkbox', function($arg) use ( $handle_args )  {
            $arg['type'] = 'checkbox';
            return $handle_args($arg, function($id, $label, $value, $required, $arg) {
                $el ='';
                $el .= '<p class="ui checkbox">';
                $el .= \helpers\html::input( $value, $arg );
                $el .= '    <label for="'.$id.'">'.$label.'</label>';
                $el .= '</p>';
                return $el;
            } );
        });

    }

    /**
     * load js plugin for admin
     */
    protected function render( $args ){
        $app = Slim::getInstance();
        array_splice( $args->modules, 1, 0, (array) array( array( "name"=>"Forms", "path"=>"form", "icon"=>"clipboard", 'require'=>$app->request()->getScriptName().'/public/plugins/forms/js/module.js') ) );
        array_walk($args->modules, function (&$item, $key)
        {
            $item['id']=$key;
        });

    }

}

return __NAMESPACE__;