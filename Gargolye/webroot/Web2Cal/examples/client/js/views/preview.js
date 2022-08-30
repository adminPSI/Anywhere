
W2CAPP.PreviewView = Backbone.View.extend({
    events:{
        "click .editbtn"        : "showEditView",
        "click .deletebtn"      : "deleteEvent",
        "click .close"          : "close"
    },
    _modelBinder: undefined,
    el: $('#eventPreview'),
    initialize: function(options) {
        this.options = options;
        this.iCal = options.calendar;
        //_.bindAll(this, "render");
        this._modelBinder = new Backbone.ModelBinder();
    },
    model: Event,
    render: function(){
        var template = _.template( this.template());
        this.$el.html( template );
        this._modelBinder.bind(this.model,  this.$el );
        this.$el.find("div."+this.model.get('color').css).addClass("selected");
        var self=this;
        //alert((this.options.windowEvent.clientX) + "#"+(this.options.windowEvent.clientY))
        Web2Cal.showPreview( this.$el ,{activeElement : this.iCal.activeEvent()
                                        , ev: this.options.windowEvent
                                       // , topOffset: jQuery("#calendarContainer").offset().top
                                       // , leftOffset: jQuery("#calendarContainer").offset().left
                                        });
        this.iCal.hideStatusMsg();

        this.$el.find(".eventcolors div").click(function(){
            var className=jQuery(this).attr("class");
            var previewingEvent = self.iCal.getEventById(self.model.get('eventId'));
            previewingEvent.color = {css:className};
            self.model.set('color', {css:className})

            self.iCal.updateEvent(previewingEvent);
            self.render();
        })
    },
    close: function(){
        this.$el.hide();
    },
    showEditView: function(){
        var event = this.model.attributes;
        event.startDate = event.startTime.toString("MM/dd/yyyy");
        event.startTimeTxt = event.startTime.toString("h:mm tt");
        event.endDate = event.endTime.toString("MM/dd/yyyy");
        event.endTimeTxt = event.endTime.toString("h:mm tt");
        event.allDayEvent = "yes";

        var groupsArr=[];
        var groups = this.iCal.getAllGroups();
        for (var x in groups) {
            if (!groups.hasOwnProperty(x)) continue;
            var grp = groups[x];
            groupsArr.push(grp);
        }
        var evOb = new Web2CalEvent(event);
        new W2CAPP.EventView({el: this.$el.parent().find("#newEventElement"), model: evOb, groups:groupsArr, calendar:this.iCal}).render();
        this.delegateEvents();
        this.$el.hide();
    },
    deleteEvent: function(){
        var self = this;
        self.model.destroy();

        this.model.destroy({}, {url:'/examples/server/php/eventService.php/event/deleteEvent', success: function(event){
            self.iCal.deleteEvent(self.model.attributes);
        }});

    }
});

