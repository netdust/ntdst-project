define(function (require) {

    "use strict";

    var ntdst               = require('ntdst');

    var $                   = require('jquery'),
        _                   = require('underscore'),

        Base                = require('app/core/view/regions/content'),

        Page                = require('app/module/pages/view/Page'),
        Meta                = require('app/module/pages/view/metaData'),

        FormView            = require('app/core/view/FormView'),
        BaseListView        = require('app/core/view/ListItemView');


    var ListItem = BaseListView.extend({
        tpl:'<div class="row collapse item" data-id="<%= id %>"><div class="columns small-8 pageinfo "><h2><%= label %></h2><h4>id: <%= id %></h4></div><div class="columns small-2 role text-right"><h5 class="radius secondary label"><%= status %></h5></div></div>',
        showItem: function(e) {
            ntdst.api.navigate( 'form/'+$(e.currentTarget).data('id'), true );
        }
    });

    var List = Base.extend({

        events : {
            'click .button':'addForm'
        },

        data : {title:'Form', label:'Create new Form'},

        initialize:function ()
        {
            this.$ul = document.createElement('ul');
            this.listenTo(this.model, 'reset', this.updateList);
        },

        updateList: function()
        {
            this.container = document.createDocumentFragment();
            this.model.each(this.addItem, this);
            $('.data ul').empty().append( this.container );
        },

        render: function ()
        {
            Base.prototype.render.apply(this, arguments);

            $('.data').empty().append( this.$ul );
            $('.data ul').addClass('list');
            this.updateList();

            return  this;
        },

        remove: function () {
            $('.data ul').remove();
            this.$ul = document.createElement('ul');
            Base.prototype.remove.apply(this, arguments);
        },

        addItem : function( item ) {
            this.container.appendChild(
                new ListItem( {model:item} ).render().el
            );
        },

        addForm: function() {
            this.trigger( 'create', 'user' );
        }
    });

    var form = Page.extend({
        metadata: Meta.extend({
            Form : FormView.extend({
                template: _.template(
                    require('text!public/plugins/forms/js/tpl/meta.html')
                )
            })
        })
    });

    return {
        list:List,
        item:ListItem,
        form:form
    }

});