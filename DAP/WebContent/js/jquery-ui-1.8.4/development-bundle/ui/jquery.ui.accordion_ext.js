(function($) {
    if ($.ui.accordion) {
        var old_clickHandler = $.ui.accordion.prototype._clickHandler;
        var new_clickHandler = function(event, target) {
            var o = this.options;
            if (o.disabled) return false;
            // called only when using activate(false) to close all parts programmatically
            if (!event.target && o.collapsible) {
                this.headers.removeClass("ui-state-active ui-corner-top")
                            .addClass("ui-state-default ui-corner-all")
                            .find(".ui-icon")
                            .removeClass(o.icons.headerSelected)
                            .addClass(o.icons.header);
                this.headers.next().addClass('ui-accordion-content-active');
                var toHide = this.headers.next(),
                            data = {
                                options: o,
                                newHeader: $([]),
                                oldHeader: o.headers,
                                newContent: $([]),
                                oldContent: toHide
                            },
                            toShow = (this.active = $([]));
                this._toggle(toShow, toHide, data);
                return false;
            }
            // get the click target
            var clicked = $(event.currentTarget || target);
            var clickedIsActive = clicked.next().css("display") != "none";
            // if animations are still active, or the active header is the target, ignore click
            if (this.running || (!o.collapsible && clickedIsActive)) {
                return false;
            }
 
            // switch classes
            clicked.toggleClass("ui-state-active")
                        .toggleClass("ui-corner-top")
                        .toggleClass("ui-state-default")
                        .toggleClass("ui-corner-all")
                        .find(".ui-icon")
                        .toggleClass(o.icons.headerSelected)
                        .toggleClass(o.icons.header);
            clicked.next().addClass('ui-accordion-content-active');
 
            // find elements to show and hide
            var toShow = clicked.next(),
                        toHide = clickedIsActive ? clicked.next() : $([]),
                        data = {
                            options: o,
                            newHeader: clickedIsActive && o.collapsible ? $([]) : clicked,
                            oldHeader: $([]),
                            newContent: clickedIsActive && o.collapsible ? $([]) : toShow.find('> *'),
                            oldContent: $([])
                        },
                        down = true;
 
            this._toggle(toShow, toHide, data, clickedIsActive, down);
 
            return false;
        };
 
        $.extend($.ui.accordion.defaults, {
            collapsible: true,
            multipleMode: false
        });
 
        $.extend($.ui.accordion.prototype, {
            _clickHandler: function(event, target) {
                if (this.options.multipleMode === true) {
                    new_clickHandler.apply(this, arguments);
                }
                else {
                    old_clickHandler.apply(this, arguments);
                }
            }
        });
    };
})(jQuery);