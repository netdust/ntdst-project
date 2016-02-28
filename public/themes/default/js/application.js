
var $ = window.jQuery = require('jquery');
$.noop = function(){};


$(document).ready(function() {


    $(".header").sticky({});

    $(".carousel").carousel();

    $('figure.hero').background({
            source: "public/themes/default/img/space.jpg"
        }
    );

});