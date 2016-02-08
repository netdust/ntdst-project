define(function (require) {

    "use strict";

    var ntdst           = require('ntdst');

    var SubRoute        = require('backbone.subroute'),

        View           = require('./view.js'),
        Model          = require('./model.js'),

        router =  SubRoute.extend({

            routes: {
                "" : "list",
                ":id" : "form"
            },

            list: function ()
            {
                var players = ntdst.api.modelFactory( 'forms', Model.collection );
                players.fetch({'reset':true});
                this.listenTo(players, 'sync', function()
                {
                    this.stopListening(players, 'sync');
                    var v = ntdst.api.viewFactory( 'forms', View.list, {model:players});
                    ntdst.api.show( '#app', v );
                });
            },

            form: function ( id )
            {
                var forms = ntdst.api.modelFactory( 'forms', Model.collection );
                var form = forms.get({'id':id});

                form.fetch({'reset':true});
                this.listenTo(form, 'sync', function()
                {
                    this.stopListening(form, 'sync');
                    var view  = ntdst.api.viewFactory( 'form'+id, View.form, {model:form});
                    ntdst.api.show( '#app', view );
                });

            }

        });

    return {

            init: function ( options )
            {
                this.router = new router(options['path']);
                return this;
            }

        };

});