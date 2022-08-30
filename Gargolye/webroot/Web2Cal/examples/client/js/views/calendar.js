
var Web2CalEvent = Backbone.Model.extend({
    urlRoot:"server/php/eventService.php/event/saveEvent",

    isNew: function(){return (this.get('eventId')) ? false : true}
});
var EventsCollection = Backbone.Collection.extend({
    model: Web2CalEvent,
    url: 'events'
});

var Group = Backbone.Model.extend({
    initialize: function(){
        this.events = new EventsCollection();
    }
});
var Groups = Backbone.Collection.extend({
    model: Group,
    url: '../server/php/calendarservice.php/calendars'
});




$(function(){


    W2CAPP.CalendarView = Backbone.View.extend({
        _modelBinder: undefined,
        initialize: function(){
            this.groupsList = new Groups();
        },
        toString:function(){
          return "calendarview";
        },
        model: Groups,
        destroy:function (  ) {
            this.iCal.destroy();
            this.$el.find("#calendarContainer").empty();
        },
        onNewEvent: function( event ,  groups, allDay) {
           var groupsArr=[];
            for (var x in groups) {
                if (!groups.hasOwnProperty(x)) continue;
                var grp = groups[x];
                groupsArr.push(grp);
            }
            var evOb = new Web2CalEvent(event);

            if( !this.eventView ){

               this.eventView =  new W2CAPP.EventView({el: this.$el.find("#newEventElement"), calContainer:this._calContainer
                    , model: evOb, groups:groupsArr, calendar:this.iCal});
            }

            this.eventView.model=evOb;
            this.eventView.render();

            this.delegateEvents()
        },
        onPreview: function(obj, dataObj, convertedHtml, windowEvent){
            new W2CAPP.PreviewView({el: this.$el.find("#previewElement"), model: new Web2CalEvent(dataObj),  calendar:this.iCal, calContainer:this._calContainer, windowEvent: windowEvent}).render();
        },
        render:function () {
            this.$el.html(this.template({groups:[]}));
            var obj = this;
            obj._calContainer=obj.$el.find("#calendarContainer");
            this.iCal = new Web2Cal( this._calContainer , {
                defaultView: "week",
                backbone: true,
                previewTemplate: null,
                timeZoneOffset: -(new Date()).getTimezoneOffset(),
                onPreview:function(ele, dataObj, convertedHtml, windowEvent){ obj.onPreview(ele, dataObj, convertedHtml, windowEvent) },
                onUpdateEvent: function( ev ){
                    ev.group={groupId:ev.group.groupId}
                    new W2CAPP.EventView({ model: new Web2CalEvent(ev),  calendar:obj.iCal}).updateEventTime();
                    //setTimeout(function(){ obj.iCal.updateEvent(ev); }, 5);
                },
                newEventTemplate: null,
                loadEvents: function(st, ed, v){
                    obj.groupsList.fetch({
                        success:function(data){
                            obj.iCal.render(data.models)
                        }
                    });
                    //setTimeout(function(){ obj.iCal.render(Web2Cal.sampleData())  }, 5);
                },
                onNewEvent:function(eventObject, groups,allDay){   obj.onNewEvent(eventObject, groups, allDay) }
            } );
            this.advancedGroups = new AdvancedGroups(this.iCal);
            this.iCal.build();
            return this;
        }
    });
});
