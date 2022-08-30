/**
 * Copyright (c) 2009, Web2Cal.  All rights reserved.
 *
 * Redistribution of this source code in any form is NOT permitted without written consent from Web2Cal:

 *     ##   ## ###### #####   ####   ####   ####  ##
 *     ##   ## ##     ##  ##     ## ##  ## ##  ## ##
 *     ## # ## ####   #####   ####  ##     ###### ##
 *     ####### ##     ##  ## ##     ##  ## ##  ## ##
 *      ## ##  ###### #####  ######  ####  ##  ## ######
 *

 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ``AS
 * IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * User: Solomon, Suresh
 * Date: ${DATE}
 * Time: ${TIME}
 */
/**
 * Creates Sample data for calendar. Used in Demos.
 * Internally uses convenient functions "createEvent" and "createGroup".
 *
 * An Event can have any number of attributes in addition to what is shown below.
 * @example
 * var group = {
 *      name: <Calendar / Group Name>
 *      groupId: <unique calendar / Group ID>
 *      events{ [
 *          <Event Object 1>,
 *          <Event Object 2>,
 *          <Event Object 3>,
 *          <Event Object 4>,
 *          <Event Object 5>,
 *      ...
 *  ]
 * }
 * @example
 * var event = {
 *      name: <String>,
 *      eventId: <String /Number>,
 *      startTime: <Date>,
 *      endTime: <Date>,
 *      description: <String>,
 *      allDay: <boolean>
 * }
 *
 * @returns {Array} list of groups
 */
Web2Cal.sampleData=function(isWorkshitView){
    var date = new Date();
    var d = date.getDate(), m = date.getMonth(), y = date.getFullYear();
    var groups = [], events = [], id=900;


    var createEvent= function( start, end, name, allDay, repeatInfo){
        var event =  {
            eventId: id++,
            startTime: start,
            endTime: end,
            name: name,
            allDay: (allDay || false)
        };
        if(repeatInfo)
            event.repeatEvent = repeatInfo;

        return event;
    };
    var createGroup = function( events, name ){
        return {
            groupId: id++,
            name: name,
            events: events
        }
    };
    var makeEventRepeatWeekly = function(selectedWeekDays, repeatEndDate){
        var repeatObject = {
            mode: "week"
            , day:null
            , week: {
                days:  selectedWeekDays
            }
            , endDate: repeatEndDate
            , repeatCount: 1
        }
        return repeatObject;
    }
    var makeEventRepeatDaily = function(onlyWeekDays, repeatEndDate){
        var repeatObject = {
            mode: "day"
            , day:{onlyWeekDays: ((onlyWeekDays)? true : false)}
            , week: null
            , endDate: repeatEndDate
            , repeatCount: 1
        }
        return repeatObject;
    }
    var makeEventRepeatMonthly = function(repeatOnDate,  mRepeatNumber,mRepeatDay , repeatEndDate){
        var repeatObject = {
            mode: repeatMode,
            day: null,
            week: null,
            month: {
                repeatOnDate: repeatOnDate,
              //  repeatOnDay: repeatOnDay,
                weekDay: mRepeatDay,
                weekNumber: mRepeatNumber
              //  repeatDay: mRepeatDay,
              //  repeatDate: mRepeatDate
            },
            year: null,
            endDate: repeatEndDate
            , repeatCount: 1
        }
        return repeatObject;
    }
    events=[];
     events.push(createEvent( new Date(y,m,d-1, 13, 0),    new Date(y,m,d-1, 14, 30), "Sales Meeting",false, makeEventRepeatDaily()  ));
    events.push(createEvent( new Date(y,m,d-14, 13, 0),    new Date(y,m,d-11, 14, 30), "Sales Meeting",false  ));
    events.push(createEvent( Date.parse("11/4/2013 2PM"),   Date.parse("11/4/2013 3PM"), "Discuss Application Design"));
    events.push(createEvent( new Date(y,m,d-2, 12, 30),   new Date(y,m,d-2, 14, 30), "Discuss Application Design"));
     events.push(createEvent( new Date(y,m,d+1, 15, 30),   new Date(y,m,d+1, 16, 30), "Any number of attributes"  ));
     events.push(createEvent( new Date(y,m,d+3, 8, 0),     new Date(y,m,d+3, 11, 30), "Event can span for many days" ));
     events.push(createEvent( new Date(y,m,d+2 ),          new Date(y,m,d+2    ), "All day event 1", true ));
    events.push(createEvent( new Date(y,m,d ),            new Date(y,m,d+4 ), "All day event 2", true ));
       groups.push(createGroup( events, "Group 1" ));

    var theGroup = groups[groups.length-1];
    for (var i = 0; i < events.length; i++) {
        var event = events[i];

        event.group=theGroup;
    }


    events=[];
    events.push(createEvent( new Date(y,m,d-18 ),       new Date(y,m,d-12    ), "All day event 1", true ));
    events.push(createEvent( new Date(y,m,d-18 ),       new Date(y,m,d-14  ), "All day event 2", true ));
    events.push(createEvent( new Date(y,m,d-18 ),       new Date(y,m,d-14  ), "All day event 3", true ));
    events.push(createEvent( new Date(y,m,d-18 ),       new Date(y,m,d-14  ), "All day event 4", true ));
    events.push(createEvent( new Date(y,m,d-17 ),       new Date(y,m,d-14 ), "All day event 5", true ));
    events.push(createEvent( new Date(y,m,d, 4, 30),   new Date(y,m,d +2, 7, 30), "Web2Cal use in all business" ));
    events.push(createEvent( new Date(y,m,d, 6, 0),     new Date(y,m,d, 8, 30), "Coliding Sales Meeting" ));
    events.push(createEvent( new Date(y,m,d, 7, 30),    new Date(y,m,d, 10, 30), "Lunch with Susie" ));
    events.push(createEvent( new Date(y,m,d+3, 13, 30), new Date(y,m,d+3, 18, 30), "Create business proposal" ));
    events.push(createEvent( new Date(y,m,d-3, 6, 30),  new Date(y,m,d-3, 8, 30), "Marathon Training" ));
    var event = createEvent( new Date(y,m,d-2, 4, 30),  new Date(y,m,d+1, 8, 30), "District Convention" );
    event.movable=false;
    event.resizable=false;

    events.push(event);
    events.push(createEvent( new Date(y,m,d, 17, 30),   new Date(y,m,d, 18, 30), "Pick-up Anshi" ));
    groups.push(createGroup( events, "Group 2" ));

    events=[];
   events.push(createEvent( new Date(y,m,d-2, 17, 30), new Date(y,m,d, 10, 30), "Daily Scrum" ));


    events.push(createEvent( new Date(y,m,d+8, 14, 30), new Date(y,m,d+8, 18, 30), "<span style='color:red'>Red Colored Event</span>" ));
    events.push(createEvent( new Date(y,m,d+2, 1, 30),  new Date(y,m,d+2, 3, 30), "<b><i><span style='color:orange'>HTML Supported!!!</span></i></b>" ));

    events.push(createEvent( new Date(y,m,d+1, 10, 0),  new Date(y,m,d+1, 12, 30), "Event <b>HTML</b> 2" ));
    events.push(createEvent( new Date(y,m,d+8, 18, 30), new Date(y,m,d+8, 22, 30), "Demom to ABC Corp" ));
    events.push(createEvent( new Date(y,m,d, 18, 0),     new Date(y,m,d, 20, 30), "Tax filing" ));
   events.push(createEvent( new Date(y,m,d, 14, 30),    new Date(y,m,d, 17, 30), "Doctor Appointment" ));
    events.push(createEvent( new Date(y,m,d, 11, 30),    new Date(y,m,d, 15, 30), "workshift event1 for user 1" ));
    events.push(createEvent( new Date(y,m,d, 19, 30),    new Date(y,m,d, 23, 30), "workshift event2 for user 1"  ));
    events.push(createEvent( new Date(y,m,d, 9, 30),    new Date(y,m,d, 10, 30), "workshift event3 for user 1" ));



    var grp = createGroup( [], "Group parent1" );
    grp.groups=[];
    grp.groups.push(createGroup( events, "Group child1" ));

    var theGroup = grp.groups[grp.groups.length-1];
    for (var i = 0; i < events.length; i++) {
        var event = events[i];

        event.group=theGroup;
        event.group={groupId: theGroup.groupId}
    }

    groups.push(grp);


    events=[];
    events.push(createEvent( new Date(y,m,d+8, 14, 30), new Date(y,m,d+8, 18, 30), "<span style='color:red'>Red Colored Event</span>" ));
    events.push(createEvent( new Date(y,m,d+2, 1, 30),  new Date(y,m,d+2, 3, 30), "<b><i><span style='color:orange'>HTML Supported!!!</span></i></b>" ));
    events.push(createEvent( new Date(y,m,d+1, 10, 0),  new Date(y,m,d+1, 12, 30), "Event <b>HTML</b> 2" ));
    events.push(createEvent( new Date(y,m,d-1, 17, 30), new Date(y,m,d, 10, 30), "Daily Scrum" ));
    events.push(createEvent( new Date(y,m,d+8, 18, 30), new Date(y,m,d+8, 22, 30), "Demom to ABC Corp" ));
    events.push(createEvent( new Date(y,m,d, 18, 0),     new Date(y,m,d, 20, 30), "Tax filing" ));
    events.push(createEvent( new Date(y,m,d, 11, 0),    new Date(y,m,d, 17, 30), "Doctor Appointment" ));
    events.push(createEvent( new Date(y,m,d, 11, 30),    new Date(y,m,d, 15, 30), "workshift event1 for user 1" ));

    events.push(createEvent( new Date(y,m,d, 21, 30),    new Date(y,m,d, 22, 30), "workshift event2 for user 1" ));
    events.push(createEvent( new Date(y,m,d, 9, 30),    new Date(y,m,d, 10, 30), "workshift event3 for user 1" ));

    var grp = createGroup( [], "Group parent2" );
    grp.groups=[];
    grp.groups.push(createGroup( [], "Group child2" ));
    var childGrp = createGroup( [], "Group child3" );
    childGrp.groups=[];
    childGrp.groups.push(createGroup( [], "Group sub child1" ));

     grp.groups.push(childGrp);
     groups.push(grp);




    return groups;
}