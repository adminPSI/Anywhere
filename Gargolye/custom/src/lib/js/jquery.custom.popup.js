(function ($) {
    var ev = new $.Event('remove'),
        orig = $.fn.remove;
    $.fn.remove = function () {
        $(this).trigger(ev);
        return orig.apply(this, arguments);
    };
})(jQuery);

(function ($) {
    /*
        arr must be defined, and it can either be an array or a function.

        If it is a function, it will check if it is a Promise or not. 
        
        If the returned value is not an array, it will throw an error.

        If it is an array, it must either be an array of normal things (strings, numbers, booleans)
        or an array of objects which have a .text attribute.
    */
    $.fn.PSlist = function (arr, opts) {
        if (typeof arr == undefined) {
            throw "Missing first argument";
        }
        if (!$.isArray(arr)) {
            if (!$.isFunction(arr)) {
                if ($.type(arr) == "object") {
                    if ($.type(arr.then) != "function") {
                        throw "Invalid first argument";
                    }
                }
                else {
                    throw "Invalid first argument";
                }
            }
        }
        else {
            if (!arr.length) {
                throw "First argument is an empty array";
            }
            var pass = true;
            arr.forEach(function (item) {
                if ($.type(item) == "object") {
                    if (typeof item.text == undefined) pass = false;
                }
            });
            if (pass == false) {
                throw "There is an invalid object in the first argument.";
            }
        }

        var settings = $.extend({
            callback: function (item) {
            },
            offset: {
                top: 0,
                left: 0
            },
            _blank: "",
            onclick: function () {

            },
            overlaysuppress: false,
            selectmultiple: false,
        }, opts);

        var buildLink = function (text, item) {
            var a = text + "";
            var o = $("<a>");
            if (a.trim() == "") {
                a = settings._blank;
            }

            if (settings.selectmultiple == true && item.isSelected == true) {
                a.css("borderColor", "red");
            }
            
            o.html(a);
            return o;
        }

        var buildOverlay = function (getMultipleSelected) {
            return $("<div>").addClass("popupoverlay").click(function () {
                if (settings.overlaysuppress === false) {

                    $(this).remove();
                    if (settings.selectmultiple == true) {
                        settings.callback.apply(target, getMultipleSelected());
                    }
                }
            });
        }

        var buildPopup = function () {
            return $("<div>").addClass("popupcontainer");
        }

        var arrType = $.type(arr);
        
        return this.each(function () {
            var target = $(this);
            var multipleSelected = [];
            target.unbind("PSlist-call").off("click").bind("PSlist-call", function () {
                var args = [];
                Array.prototype.push.apply(args, arguments);
                args.shift();
                settings.callback.apply(target, args);
            }).on("click", function createPopup() {
                multipleSelected = [];
                settings.onclick();
                var overlay = buildOverlay(function () {
                    return multipleSelected;
                });
                var popupbox = buildPopup().bind("remove", function () {
                    overlay.remove();
                });

                var t = target;
                while (t.css("zoom") == 1 && t.prop("tagName").toUpperCase() != "HTML") {
                    t = t.parent();
                }

                var zoom = t.css("zoom");

                overlay.css("zoom", zoom)
                $("body").append(overlay);

                $(".popupcontainer").remove();

                popupbox.click(function (e) {
                    e.stopPropagation();
                }).css({
                    top: target.offset().top + settings.offset.top,
                    left: target.offset().left + settings.offset.left,
                    width: target.width()
                }).show(function () {
                    if (((popupbox.offset().top * zoom) + (popupbox.height() * zoom)) > window.innerHeight) {
                        if (zoom == 1) popupbox.css("marginTop", "-" + ((popupbox.offset().top + popupbox.height() - window.innerHeight) + 40) + "px");
                        else popupbox.css({
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        })
                    }
                });

                var stepArray = function (arr) {
                    if (typeof arr == "function") {
                        return stepArray(arr());
                    }
                    if (typeof arr == "object" && typeof arr.then == "function") {
                        return arr.then(stepArray);
                    }
                    if (!$.isArray(arr)) {
                        throw "Somehow a non-array has been passed to stepArray. This is likely caused by a function not returning an array.";
                    }
                    if (!arr.length) {
                        popupbox.remove();
                        throw "Array passed has zero items.";
                    }
                    arr.forEach(function (item) {
                        var text = item;
                        if ($.type(item) == "object") {
                            text = item.text;
                        }

                        if (item.isSelected === true) {
                            multipleSelected.push(item);
                        }

                        var a = buildLink(text, item);
                        a.click(function (e) {
                            
                            if (settings.selectmultiple == false) {
                                settings.callback.apply(target, [item]);
                                e.preventDefault();
                                popupbox.remove();
                            }
                            else {
                                var ind = multipleSelected.indexOf(item);
                                if (ind >= 0) {
                                    multipleSelected.splice(ind, 1);
                                    $(this).css("borderColor", "#cfe371");
                                }
                                else {
                                    multipleSelected.push(item);
                                    $(this).css("borderColor", "red");
                                }
                            }
                        })
                        popupbox.append(a);
                       
                    });

                    overlay.append(popupbox);
                }
                stepArray(arr);
            });
        });
    }
})(jQuery);