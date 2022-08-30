(function ($) {
    /*
        Argument format:
        {
            title: "",  //Not required; if it is there, it must be either a string (of HTML) or a jQuery HTML object
            body: "",   //Not required; if it is there, it must be either a string (of HTML), a jQuery HTML object, a function that returns those two, or a promise that returns those two
            buttons: [] //Not required; if it is there, it is either an array of JavaScript objects in the below format or a function that returns that array, or a promise that returns the array
            {
                text: "",    //Required, must be HTML string
                callback: function() {}, //Not required; if it is there, it must be a JavaScript function
                bgColor: "", //Not required; if it is there, it must be a string
                color: "", //Not required; if it is there, it must be a string
            },
            closeOnBlur: true,   //not required; boolean. If true, if the user clicks off of the modal, it closes.
            theaterMode: true,  //not required; boolean. If true, the rest of the browser dims.
            onbefore: function() {}, //Runs before the modal displays. If returns true, display the modal. Otherwise, do not display the modal.
                                    //If you do this, and you want an error modal to appear, run another modal by using $.fn.PSmodal({body: "What you want", immediate: true});
            immediate: false        //Not required; if is true, it will immediately display, instead of calling on click of an object.
        }
    */
    $.fn.PSmodal = function (opts) {
        var settings = $.extend({
            title: "",
            body: "",
            buttons: [],
            closeOnBlur: true,
            theaterMode: true,
            onbefore: function () {
                return true;
            },
            immediate: false
        }, opts);

        var buttonAudit = function (button) {
            if (typeof button.text != "string") {
                throw "Invalid button format. Please check the documentation.";
            }
        };

        var buildOverlay = function () {
            var overlay = $("<div>").addClass("modaloverlay");
            overlay.click(function (e) {
                e.stopPropagation();
            })
            if (settings.closeOnBlur == true) {
                overlay.click(function () {
                    $(this).remove();
                });
            }
            if (settings.theaterMode == true) {
                overlay.css({
                    "backgroundColor": "rgba(0, 0, 0, 0.15)"
                });
            }

            return overlay;
        };

        var buildTitle = function (title) {
            return $("<div>").addClass("modaltitle").html(title);
        };

        var buildBody = function (body) {
            if (typeof body == "function") {
                return buildBody(body());
            }
            if (typeof body == "object" && typeof body.then == "function") {
                return body.then(buildBody);
            }
            return $("<div>").addClass("modalbody").html(body);
        };

        var buildButtons = function (buttons, body) {
            var buttonHolder = $("<div>").addClass("modalbuttons");
            buttons.forEach(function (button) {
                var b = $("<button>").html(button.text);
                if (button.callback) {
                    b.click(function (e) {
                        e.stopPropagation();
                        var a = button.callback(body);
                        if (a !== false) {
                            buttonHolder.parent().remove();
                        }
                    });
                }
                if (button.bgColor) {
                    b.css("backgroundColor", button.bgColor);
                }
                if (button.color) {
                    b.css("color", button.color);
                }
                buttonHolder.append(b);
            });
            return buttonHolder;
        };

        var buildModal = function (opts) {
            var title = buildTitle(opts.title);
            var body = buildBody(opts.body);
            var footer = buildButtons(opts.buttons, body);
            return $("<div>").addClass("modalcontainer").append(title).append(body).append(footer);
        };

        var createModal = function () {
            if (!settings.onbefore()) {
                return;
            }
            //https://stackoverflow.com/questions/1118198/how-can-you-figure-out-the-highest-z-index-in-your-document
            var maxZ = Math.max.apply(null,
                $.map($('body *'), function (e, n) {
                    if ($(e).css('position') != 'static')
                        return parseInt($(e).css('z-index')) || 1;
                }));
            var overlay = buildOverlay();
            overlay.css("zIndex", maxZ+1)
            var modal = buildModal(settings).click(function (e) {
                e.stopPropagation();
            }).bind("remove", function () {
                overlay.remove();
            });

            overlay.append(modal);
            modal.show()/*.css({
                position: "absolute",
                top: "95px",
                left: "95px"
            });*/


            $(".modalcontainer").remove();

            $("body").append(overlay);
        };

        if (settings.immediate) {
            createModal();
            return this.each(function () {
            });
        }

        return this.each(function () {
            $(this).on("click", createModal);
        });
    };
})(jQuery);