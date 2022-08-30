var W2CAPP = {
    views: {},
    models: {},
    loadTemplates: function(views, callback) {
        var deferreds = [];
        $.each(views, function(index, view) {
            if (W2CAPP[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    W2CAPP[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });
        $.when.apply(null, deferreds).done(callback);
    }
};

W2CAPP.Router = Backbone.Router.extend({
    routes: {
        "":                 "home",
        "calendar":         "calendar",
        "contact":          "contact"
    },

    initialize: function () {
        W2CAPP.shellView = new W2CAPP.ShellView();
        $('body').html(W2CAPP.shellView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
        this.$content = $("#content");
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        //if (!W2CAPP.homelView) {


        W2CAPP.homelView = new W2CAPP.HomeView();
        W2CAPP.homelView.render();

        /*} else {
         console.log('reusing home view');
         W2CAPP.homelView.delegateEvents(); // delegate events when the view is recycled
         }*/
        this.$content.html(W2CAPP.homelView.el);
        W2CAPP.shellView.selectMenuItem('home-menu');
    },

    contact: function () {
        if (!W2CAPP.contactView) {
            W2CAPP.contactView = new W2CAPP.ContactView();
            W2CAPP.contactView.render();
        }
        this.$content.html(W2CAPP.contactView.el);
        W2CAPP.shellView.selectMenuItem('contact-menu');
    },

    calendar: function () {
        // Since the home view never changes, we instantiate it and render it only once
        //if (!W2CAPP.homelView) {
        if (W2CAPP.calendarView) {
            W2CAPP.calendarView.destroy();
        }

        W2CAPP.calendarView = new W2CAPP.CalendarView();
        W2CAPP.calendarView.render();

        /*} else {
         console.log('reusing home view');
         W2CAPP.homelView.delegateEvents(); // delegate events when the view is recycled
         }*/
        this.$content.html(W2CAPP.calendarView.el);
        W2CAPP.shellView.selectMenuItem('calendar-menu');
    }
});

$(document).on("ready", function () {
    W2CAPP.loadTemplates(["HomeView","CalendarView","GroupManagerView", "ContactView", "ShellView", "EventView", "PreviewView"],
        function () {
            W2CAPP.router = new W2CAPP.Router();
            Backbone.history.start();
        });
});
