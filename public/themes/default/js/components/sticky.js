//@todo: resizing sticky elements

;(function ($, Formstone, undefined) {

    "use strict";

    /**
     * @method private helpers
     */
    var _getScrollY = function(scroller) {
        return (scroller.pageYOffset !== undefined)
            ?  scroller.pageYOffset : (scroller.scrollTop !== undefined)
            ?  scroller.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    },
    _getElementY = function (elm, offset) {
        return elm.parent().offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset;
    };

    /**
     * @method private
     * @name construct
     * @description Builds instance.
     * @param data [object] "Instance data"
     */

    function construct(data) {

        this.wrap('<div class="' + [
                RawClasses.base,
                data.wrapperClassName
            ].join(" ") + '"></div>');

        $window.on(Events.load, data, $.proxy( update, this ) );
        $window.on(Events.resize, data, $.proxy( resize, this ) );
        $window.on(Events.scroll, data, $.proxy( update, this ) );

    }

    function toleranceExceeded(currentScrollY, lastY) {
        return Math.abs(currentScrollY-lastY) >= tolerance[currentScrollY > lastY ? 'down' : 'up'];
    }

    function update(e) {

        e.data.currentScrollY      = _getScrollY(e.data.scroller);
        e.data.elementScrollY      = _getElementY(e.data.$el, e.data.offset);
        e.data.toleranceExceeded   = toleranceExceeded(e.data.currentScrollY, e.data.lastY);

        if (e.data.elementScrollY >= e.data.currentScrollY ) {
            unstick(e.data);
        } else {
            stick(e.data);
        }

        var scrollingDown = e.data.currentScrollY > e.data.lastY,
            scrollingUp = e.data.currentScrollY < e.data.lastY;

        if( scrollingDown && e.data.currentScrollY >= e.data.offset && toleranceExceeded ) {
            e.data.$el.removeClass(e.data.classShow).addClass(e.data.classHide);
        }
        else if( scrollingUp && toleranceExceeded || e.data.currentScrollY <= e.data.offset ) {
            e.data.$el.removeClass(e.data.classHide).addClass(e.data.classShow);
        }

        e.data.lastY = e.data.currentScrollY;
    }

    function resize(e) {
        if( e.data.$el.css("position") === 'fixed') {
            e.data.$el
                .css('width', e.data.$el.css("box-sizing") === "border-box"
                    ? e.data.$el.parent().outerWidth() + "px" : e.data.$el.parent().width() + "px");
        }
    }


    function stick(data) {
        if( data.$el.css('position') !== 'fixed' ) {
            data.$el.parent()
                .addClass(data.className)
                .css('height', data.$el.outerHeight());

            data.$el
                .css('left', data.$el.offset().left )
                .css('top', data.offset)
                .css('bottom', '')
                .css('position', 'fixed');

            data.$el.trigger('sticky-start', [data]);
        }

        //bottoming(data);
    }

    function unstick(data) {
        if( data.$el.css('position') === 'fixed' ) {
            data.$el.css('position', 'relative')
                .css('bottom', '')
                .css('left', '')
                .css('top', '');

            data.$el.removeClass(data.className);

            data.$el.trigger('sticky-end', [data]);
        }
    }

    function bottoming(data) {

        var container = data.$el.parent().parent().parent();

        var el_bottom = data.currentScrollY + _getElementY( data.$el, data.offset ) + data.$el.parent().height();
        var cn_bottom = container.offset().top + container.height();

        if( el_bottom >=  cn_bottom ) {
            data.$el.parent()
                .addClass(data.className)
                .css('height', container.outerHeight());
            data.$el.css({
                position: "absolute",
                bottom: 0,
                top: "auto",
                left: "auto"
            }).trigger("sticky-bottom");
        }

    }
    /**
     * @method private
     * @name destruct
     * @description Tears down instance.
     * @param data [object] "Instance data"
     */

    function destruct(data) {
        unstick(data);
        this.unwrap();
        this.removeClass( [RawClasses.base, data.customClass].join(" ") );

        $window.off(Events.scroll)
            .off(Events.resize);
    }

    /**
     * @plugin
     * @name Tooltip
     * @description A jQuery plugin for simple tooltips.
     * @type widget
     * @main tooltip.js
     * @main tooltip.css
     * @dependency jQuery
     * @dependency core.js
     */

    var Plugin = Formstone.Plugin("sticky", {
            widget: true,

            /**
             * @options
             * @param offset [int|string] <0> "Hover delay"
             * @param offsetSide [string] <0> "Hover delay"
             * @param className [string] <'is-sticky'> "Tooltip direction"
             * @param wrapperClassName [string] <'sticky-wrapper'> "Flag to follow mouse"
             * @param center [boolean] <true> "Text format function"
             */

            defaults: {
                offset: 0,
                offsetSide: "top",
                className: 'is-sticky',
                wrapperClassName: 'sticky-wrapper',
                classShow: 'is-shown',
                classHide: 'is-hidden',
                center: false,
                scroller:window
            },

            methods: {
                _construct    : construct,
                _destruct     : destruct
            }
        }),

    // Localize References

        Classes       = Plugin.classes,
        RawClasses    = Classes.raw,
        Events        = Plugin.events,
        Functions      = Plugin.functions,


    // Internal

        $window       = $(window),

        tolerance     = { down : 0, up : 0};

})(jQuery, Formstone);