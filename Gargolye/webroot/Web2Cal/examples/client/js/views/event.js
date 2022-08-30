
/**
 * Event View
 * @type {*}
 */
W2CAPP.EventView = Backbone.View.extend({
    events:{
        "click #addEventBtn"        : "save",
        "click #updateEventBtn"     : "update",
        "click #closeNewEventBtn"   : "close",
        "change #repeatMode"         : "showRepeatPattern",
        //  "change:repeatMode"         : "showRepeatPattern",
        "change #repeatType"         : "showRepeatType"
    },
    //template: _.template($("#country_select_template").html()),
    _modelBinder: undefined,
    el: $('#eventDialog'),
    initialize: function(options) {
        this.options = options;
        this.iCal = options.calendar;
        this.calContainer = options.calContainer;
        _.bindAll(this, "render");
        this._modelBinder = new Backbone.ModelBinder();
        // this.render();
    },
    model: Event,

    preRender: function(){
       var self=this, event = this.model;

        event.set('startDate', event.get('startTime').toString("MM/dd/yyyy") );
        event.set('startTimeTxt',  event.get('startTime').toString("h:mm tt") );
        event.set('endDate', event.get('endTime').toString("MM/dd/yyyy") );
        event.set('endTimeTxt' , event.get('endTime').toString("h:mm tt") );
        event.set('allDayEvent', "yes" );

        if( self.model.repeatObject ){
           this.model.set({
                repeatMode:self.model.repeatObject.type
               ,repeatType:self.model.repeatObject.mode
               ,onlyWeekDays:(self.model.repeatObject.day && self.model.repeatObject.day.onlyWeekDays) ?"yes":"no"
               ,monthRepeatDate:((self.model.repeatObject.month) ? self.model.repeatObject.month.monthRepeatDate : 0)
               ,monthWeekNumber:((self.model.repeatObject.month) ? self.model.repeatObject.month.weekNumber : 0)
               ,monthDayNumber:((self.model.repeatObject.month) ? self.model.repeatObject.month.weekDay : 0)
               ,repeatEndDate:self.model.repeatObject.endDate.toString('MM/dd/yyyy')
               ,repeatUntil: ((self.model.repeatObject.endDate==null || self.model.repeatObject.endDate=="")?"":"endsOn")
           });
        }
    },
    render: function() {
        this.preRender();
        var template = _.template( this.template({groups: this.options.groups}), {} );
        this.$el.html( template );
        this._modelBinder.bind(this.model,  this.$el );

        //this.$el.find('#eventDialog select').trigger('change').selectpicker();
        Web2Cal.showNewEventForm( this.$el ,{activeElement : this.iCal.activeEvent()
            , topOffset: this.calContainer.offset().top
            , leftOffset: this.calContainer.offset().left
        });
        return this;
    },
    update: function( eventObj ){
        var self = this;
        this.createEventObjectFromForm();
        //this.model.set( eventObj );
        this.model.save({}, {url:'../server/php/eventService.php/event/updateEvent', success: function(event){
            self.iCal.updateEvent(event.attributes);
            self.$el.hide();
            Web2Cal.closeAddEvent();
        }});
    },
    updateEventTime: function(e){
        var self=this;
        this.model.save({}, {url:'../server/php/eventService.php/event/updateEvent', success: function(event){
            self.iCal.updateEvent(event.attributes);
        }});
        e.stopPropagation();
        e.preventDefault();
    },
    showRepeatType: function(){
        var self = this;
        this.$el.find("#repeatInfo")
            .find(".subrepeatpattern").hide().end()
            .find("#subrepeat"+self.$el.find("#repeatType").val()).show();
    },
    showRepeatPattern: function(){
        var self = this;
        this.$el.find("#repeatInfo")
            .find(".repeatPattern").hide().end()
            .find("#repeat"+self.$el.find("#repeatMode").val()).show()
            .find(".default").each(function(){
                var jq=jQuery(this);
                if(jq.is("select")){
                    jq.find("option:eq(0)").attr("selected", true);
                }else{
                    jq.show();
                }
            });
    },
    createRepeatObject: function(){
        var self = this;
        var repeatMode = this.$el.find("#repeatMode").val(), repeatObject;
        if( repeatMode == "" )
            return null;

        if( repeatMode == "day" ){
            repeatObject = {mode: "day", day:{onlyWeekDays:false}};
        } else
        if( repeatMode == "weekday" ){
            repeatObject = {mode: "day", day:{onlyWeekDays:true}};
        } else
        if( repeatMode == "week" ){
            repeatObject = {mode: "week", week:{ days:self.model.get('startTime').getDay()}};
        } else
        if( repeatMode == "month" ){
            repeatObject = {mode: "month", month: {monthRepeatDate:self.model.get('startTime').clone()} };
        } else
        if( repeatMode == "year" ){
            repeatObject = {mode: "month", year: {repeatDate:self.model.get('startTime').clone()} };
        } else
        if( repeatMode == "custom" ){

            var custRepeatType = this.$el.find("#repeatType").val(), day={}, week={}, month={}, year={};
            if( custRepeatType == "day"){
                day.onlyWeekDays = this.$el.find("#onlyweekdays").get(0).checked;
            } else
            if( custRepeatType == "week"){
                var daysArr=[];
                this.$el.find("#repeatdays").find(".a-day").each(function(i){
                    daysArr.push(i);
                });
                week.days=daysArr.join(",");
            } else
            if( custRepeatType == "month"){
                this.$el.find("#repeatdays").find(".monthoptions.selected").each(function(){
                    var jqEle = jQuery(this);
                    if( jqEle.is(".ondate") ){
                        month.repeatDate = self.model.get('startTime').clone();
                    }else{
                        month.weekNumber = self.$el.find("#monthWeekNumber").val();
                        month.weekDay = self.$el.find("#monthDayNumber").val();
                    }
                });
            } else
            if( custRepeatType == "year"){
                year.repeatDate = self.$el.find("#yearRepeatDate").val();
            }

            repeatObject = {mode: custRepeatType, day: day, week: week, year: year, month:month};
        }

        repeatObject.repeatCount = self.$el.find("#repeatCount").val();
        repeatObject.endDate = Date.parse( self.$el.find("#repeatEndDate").val() );

        return repeatObject;

    },
    createEventObjectFromForm: function(){
        var self = this;
        var startTime = Date.parse( this.$("#startDate").val() +" "+this.$("#startTimeTxt").val() );
        var endTime = Date.parse( this.$("#endDate").val() +" "+this.$("#endDateTxt").val() );
        this.model.set({'eventName': this.$('#eventName').val()
            , 'startTime': startTime
            , 'endTime': endTime
            , 'allDayEvent': this.$("#allDayEvent").val()
            , groupId: this.$("#groupsDropDown").val()
            , notes: this.$("#eventDescription").val()
            , group: {groupId: self.$("#groupsDropDown").val()}
        });

        this.model.set('repeatObject',this.createRepeatObject());
    },
    save: function(e) {
        if( jQuery(e.target).is("#addEventBtn") ){
            this.createEventObjectFromForm();
            var self=this;
            this.model.save({}, {url:'../server/php/eventService.php/event/saveEvent', success: function(event){
                self.iCal.addEvent(event.attributes);
                self.$el.hide();
                Web2Cal.closeAddEvent();
            }});
        }else{
            this.update();
        }
        e.stopPropagation();
        e.preventDefault();
    },
    close: function() {
        this.$el.hide();
        Web2Cal.closeAddEvent();
    }
});