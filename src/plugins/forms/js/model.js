define(function (require) {

    "use strict";

    var ntdst           = require('ntdst');

    var _               = require('underscore'),
        Backbone        = require('backbone'),

        Page            = require('app/core/model/Page');

    var FormModel = Page.extend({

        urlRoot: ntdst.options.api + "form",

        schema:  {
            status      : {type: 'Select', options: function(callback, editor) {
                callback(  ntdst.api.hasPermission('publish_page') ? ['publish', 'private', 'draft', 'trash'] : ['draft'] );
            } },
            label       : {type:"Text", placeHolder:"Label", message: 'Invalid label', validators: ['required'] }
        }

    });

    var FormsCollection = Backbone.Collection.extend({
        url: ntdst.options.api + "forms",
        model: FormModel
    });

    return {
        model: FormModel,
        collection: FormsCollection
    };
});