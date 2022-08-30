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
 *
 * Copyright (c) 2008 WEB2CAL  All Rights Reserved.
 * User: Solomon, Suresh
 * Date: ${DATE}
 * Time: ${TIME}

 ------------------------------------------------------------------------------------------------------------
 * WEB2CAL SUPPORTING FILE. All Constants, Language and options defined in here
 * 2 functions defined (showPreview) and (showNewEventForm) are invoked to display the forms and preview
 * on click of event. Use this function to customize your popup
 -----------------------------------------------------------------------------------------------------------
 */

/**
 *@class Web2Cal
 */

/**
 *
 * English Dictionary for Web2Cal.
 * property LANG_EN
 * @type {object}
 * @default English is default language for Web2Cal.
 * Language can be changed by assigning
 * Web2Cal.LANG to desired language.
 *
 * @example Web2Cal.LANG = LANG_ES will display the calendar in Spanish language.
 */
Web2Cal.LANG_EN={
        CLOSE: "Close"
        ,DAYS:[ "Sunday", "Monday","Tuesday","Wednesday", "Thursday" , "Friday","Saturday"]
        ,DAYS_SHORT: [ "Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        ,DAYS_SHORT2: [ "Su","Mo", "Tu", "We", "Th", "Fr", "Sa"]
        ,MONTHS_SHORT: ["Jan", "Feb","Mar", "Apr","May" ,"Jun", "Jul","Aug", "Sep","Oct","Nov","Dec"]
        ,MONTHS: ["January", "February","March", "April","May" ,"June", "July","August", "September","October","November","December"]
        ,LABEL_MONTH: "Month"
        ,LABEL_WEEK: "Week"
        ,LABEL_DAY: "Day"
        ,LABEL_NEXT: "Next "
        ,LABEL_PREVIOUS: "Previous "
        ,LABEL_NEXT_BTN: ">"
        ,LABEL_PREVIOUS_BTN: "<"
        ,LABEL_AGENDA: "Agenda"
        ,LABEL_WORKSHIFT: "Workshift"
        ,LABEL_DAYS: "Days"
        ,LABEL_SCHEDULER: "Scheduler"
        ,LABEL_BLOCKWEEK: "Week Block"
        ,LABEL_WORKWEEK: "Work Week"
        ,LABEL_YEARVIEW: "Year"
        ,LABEL_W2CVIEW: "Resource"
        ,LABEL_PERIODIC: "Periodic"
        ,LABEL_TODAY: "Today"
        ,LABEL_PRINT: "Print"
        ,LABEL_HIDESHOW: "Groups"
        ,LABEL_RECUR_EDIT_WINDOW:"Edit Recurring Event"
        ,LABEL_EDIT_RECUR_EVENT_DESC: "This is a repeating Event. <br/>Would you like to change only this event, or all events in the series?"
        ,LABEL_IS_RECURRING_EVENT: "This is a recurring Event"
        ,LABEL_AM: "AM"
        ,LABEL_PM: "PM"
        ,LABEL_TO: "To"
        ,LABEL_EVENTS: "Events"
        ,LABEL_EVENTNAME: "Event Name"
        ,LABEL_STARTDATE: "Start Date"
        ,LABEL_STARTTIME: "Start Time"
        ,LABEL_ENDDATE: "End Date"
        ,LABEL_ENDTIME: "End Time"
        ,LABEL_GROUP: "Group"
        ,LABEL_ALLDAY: "All Day?"
        ,LABEL_CREATEEVENT: "Create Event"
        ,LABEL_DESCRIPTION: "Description"
        ,LABEL_INFORMATION: "Information"
        ,LABEL_VIEWALL: "View All"
        ,MSG_AGENDA_NO_EVENTS: "No events found in the range selected. "
        ,LABEL_NOTITLE: "No Title"
        ,LABEL_CREATENEWEVENT: "Create New Event"
        ,LABEL_CREATENEW: "Create New"
        //,LABEL_OPTIONS: "Settings"
        ,LABEL_OPTIONS: "More"
        ,LABEL_FILTER: "Filter"
        ,LABEL_EXPAND_DETAILS: "Expand Details"
        ,LABEL_COLLAPSE_DETAILS: "Collapse Details"
        ,LABEL_MORE: "More"
        ,LABEL_CREATENEWGROUP: "New"
        ,MSG_LOADINGMSG: "Loading.. Please Wait"
        ,MSG_RETRIEVING: "Getting Events"
        ,MSG_WAIT: "Please Wait..."
        ,MSG_UPDATING: "Updating..."
        ,MSG_WS_EVENT_STARTS: "Event Starts at {0}"
        ,MSG_WS_EVENT_ENDS: "Event Ends at {0}"
        ,MSG_VIEW_NOTFOUND:"View '{0}' Not found. \nCheck your settings. The Default View may not be in the selected views"
    };

/**
* Assign the default language to be used.
* Change this variable to a corresponding language array to display calendar in different languages.
*/
Web2Cal.LANG = Web2Cal.LANG_EN;


/**
 * Method to Show Preview. This function in web2cal.support.js contains the
 * implementation to display a preview window when an event is clicked.
 *
 *
 *
 * @static
 * @method showPreview
 * @param {object} jQuery Element
 * @param {object} options {<br/>
 * 			1. container - jQuery Container Object <br/>
 * 			2. activeElement - Element that was clicked on<br/>
 * 			3. perspective - Left | Top <br/>}
 */
Web2Cal.showPreview=function(form, options)
{
    var $win = jQuery(window)
        ,$form = jQuery(form)
        ,$el = jQuery(options.activeElement)
        ,$pointer = jQuery(form).find(".aPointer").css({top: "5px"}).removeClass("p-left p-right p-bottom p-top")
        , pointerClass="p-right",windowEvent=options.ev
        , leftOffset = (options.leftOffset || 0) +20    // to compensate pointer
        , pointerOffset = 6
        , topOffset = (options.topOffset || 0)  - 10// to compensate pointer
        ,  left=windowEvent.clientX + leftOffset
        , top=windowEvent.clientY - $form.height()/pointerOffset +topOffset +WUtil.getBodyScrollY();
        // orientation here...
      /*  var left =  $el.offset().left + $el.width();
        var  top = $el.offset().top - $form.height()/2 + $el.height()/2;*/
        if( $win.width() > (left + $form.width())){
            pointerClass = "p-left";
        }else{
            left = left  - $form.width() - 30; // pointer offset
        }
        $pointer.addClass(pointerClass);
        var pointerTop = $form.height()/pointerOffset;

        var relativeElePos = top + $form.outerHeight() + $el.height()/pointerOffset  - $win.scrollTop();

        if( relativeElePos > $win.innerHeight()){
            // offset the top
            var bleed = relativeElePos - $win.innerHeight();
            top = top  - bleed ;
            pointerTop = $form.height()/pointerOffset  + bleed;
        } else{
            //   pointerTop = $form.height() - 5;
        }
        $pointer.css({
            top:pointerTop
        });
         $form.show().css({
            top:    top
            ,left:   left
        });

}

/**
 * Following function is invoked when web2cal is rendered in mobile mode
 *
 * @static
 * @method showMobileForm
 * @param element
 * @param options
 */
Web2Cal.showMobileForm = function(element, options){
    Web2Cal.PageHandler.showPage(options.container,element, false);
}
/**
 * Following function is invoked when web2cal is rendered in mobile mode
 *
 * @method showMobilePreview
 * @static
 * @param element
 * @param options
 */
Web2Cal.showMobilePreview = function(element, options){
    Web2Cal.PageHandler.showPage(options.container,element, false);
}
/**
 * Method to Show New Event Form
 *
 * @static
 * @method showNewEventForm
 * @param {jQuery} jQuery Element
 * @param {Array} options
 * 			1. container - jQuery Container Object
 * 			2. activeElement - New Event Element that was just created.
 * 			3. perspective - Left | Top
 */
Web2Cal.showNewEventForm=function(form, options) {

    var $win = jQuery(window)
        ,$form = jQuery(form)
        ,pointerOffset=6
        ,$el = jQuery(options.activeElement)
        ,$pointer = jQuery(form).find(".aPointer").css({top: "5px"}).removeClass("p-left p-right p-bottom p-top")
        ,pointerClass="p-right";
    if ( options.asPopup)
    {
        options.activeElement.style.display = "none";
        new Web2CalModal({contents: element, model:"modal",title: "Create New Event"}).show();
    }
    else
    {
        // orientation here...
        var left =  $el.offset().left + $el.width();
            var  top = $el.offset().top - $form.height()/pointerOffset + $el.height()/2;
        if( $win.width() > (left + $form.width())){
            pointerClass = "p-left";
        }else{
            left = $el.offset().left  - $form.width();
        }
        $pointer.addClass(pointerClass);
        var pointerTop = $form.height()/pointerOffset - 5;

        var relativeElePos = top + $form.outerHeight() + $el.height()/pointerOffset  - $win.scrollTop();

        if( relativeElePos > $win.innerHeight()){
            // offset the top
            var bleed = relativeElePos - $win.innerHeight();
            top = top  - bleed ;
            pointerTop = $form.height()/pointerOffset  + bleed;
        } else{
            //   pointerTop = $form.height() - 5;
        }
        $pointer.css({
            top:pointerTop
        });


        $form.show().css({
             top:    top - options.topOffset
            ,left:   left -options.leftOffset });
    }
}

/**
 * Variable to indicate the start of week
 *  property START_OF_WEEK
 * @constant
 * @type {Number}
 * @default (0) - for Sunday
 */
Web2Cal.START_OF_WEEK = 0;
/**
 * If the new event template is displayed as pop,
 *  then this variable holds the width of the popup
 * property NEW_EVENT_POPUP_WIDTH
 * @constant
 * @type {Number}
 * @default
 */
Web2Cal.NEW_EVENT_POPUP_WIDTH	= 500;
/**
 * If the new event template is displayed as pop,
 *  then this variable holds the height of the popup

 * prop erty NEW_EVENT_POPUP_HEIGHT
 * @constant
 * @type {Number}
 * @default
 */
Web2Cal.NEW_EVENT_POPUP_HEIGHT	= 350;
/**
 * Height of each event block in month view.
 *
 * property MONTH_EVENT_HEIGHT
 * @constant
 * @type {Number}
 * @default (14) in pixels
 */
Web2Cal.MONTH_EVENT_HEIGHT = 14;
/**
 * WIDTH OF THE window, below which the mobile mode should kick in.
 *
 * @constant
 * @type {Number}
 * @default
 */
Web2Cal.MOBILE_MAX_WIDTH = 800;
Web2Cal.DAY_ALLDAY_EVENT_HEIGHT = 18;
Web2Cal.NEW_EVENT_STYLE="grayTemplate";
Web2Cal.WEEK_ALLDAY_DEFAULT_HEIGHT=20;
Web2Cal.WEEK_VIEW_PADDING=.4;
Web2Cal.WEEK_VIEW_PADDING=.4;
Web2Cal.MONTH_EVENT_TOP_START=14;
Web2Cal.MONTH_EVENT_Y_SPACING=3;
Web2Cal.WEEK_VIEW_EVENT_RIGHT_MARGIN=0.7;
Web2Cal.MESSAGE_AUTOCLOSE_TIME=4000; //In milliseconds. 2 seconds default. Time for which message will be displayed if autoclose is provided as true. ical.showStatusMsg("Msg", true);
Web2Cal.SCHEDULER_TITLE_DATE_FORMAT="ddd d  MMM"; //Format in Title. Example: "Apr 10, 2010".

/*Date and Time Formats*/
Web2Cal.DATE_FORMAT="MM/dd/yyyy";
Web2Cal.TIME_FORMAT="hh:mm tt";
Web2Cal.TIME_FORMAT_24="HH:mm";
Web2Cal.WEEK_TITLE_DATE_FORMAT1="MMM d"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 4"
Web2Cal.WEEK_TITLE_DATE_FORMAT2="MMM d, yyyy"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 10, 2010"
Web2Cal.WEEK_HEADER_DATE_FORMAT="ddd, MMM d"; //Format in week view header. Example: "Tue, Apr 6"
Web2Cal.MONTH_TITLE_DATE_FORMAT="MMMM, yyyy"; //Format for Title in Month. Example: "April, 2010"
Web2Cal.AGENDA_TITLE_DATE_FORMAT1="MMM d"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 4"
Web2Cal.AGENDA_TITLE_DATE_FORMAT2="MMM d, yyyy"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 10, 2010"
Web2Cal.AGENDA_TITLE_DATE_FORMAT3="ddd MMM  d, yyyy"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 10, 2010"
Web2Cal.WS_TITLE_DATE_FORMAT="MMM d, yyyy"; //Format in Title. Example: "Apr 10, 2010".
Web2Cal.W2C_TITLE_DATE_FORMAT="MMM d, yyyy"; //Format in Title. Example: "Apr 10, 2010".

/*End of Formats*/

/*Create an entry in CSS File with specific colors and make an entry in the following array.*/
/**
 * List of Colors to be used.
 * @p roperty colors
 *
 * @type {Array} of Color Objects.
 *
 * @example {color:"blue", css: "blueTemplate"}
 */
Web2Cal.colors=new Array();
Web2Cal.colors.push({color:"blue", css: "blueTemplate"});
Web2Cal.colors.push({color:"red", css: "red"});
Web2Cal.colors.push({color:"brick", css: "brickTemplate"});
Web2Cal.colors.push({color:"teal", css: "tealTemplate"});
Web2Cal.colors.push({color:"lightGreen", css: "lightGreenTemplate"});
Web2Cal.colors.push({color:"brown", css: "brownTemplate"});
Web2Cal.colors.push({color:"lightPurple", css: "lightPurpleTemplate"});
Web2Cal.colors.push({color:"brightGreen", css: "brightGreenTemplate"});
Web2Cal.colors.push({color:"dirtyYellow", css: "dirtyYellowTemplate"});
Web2Cal.colors.push({color:"green", css: "greenTemplate"});
Web2Cal.colors.push({color:"gray", css: "grayTemplate"});
Web2Cal.colors.push({color:"dirtyPink", css: "dirtyPinkTemplate"});
Web2Cal.colors.push({color:"purple", css: "purpleTemplate"});
Web2Cal.colors.push({color:"cyan", css: "cyanTemplate"});
Web2Cal.colors.push({color:"brightBlue", css: "brighBlueTemplate"});
Web2Cal.colors.push({color:"pink", css: "pinkTemplate"});


/**
 *
 *
 @static
 @since 3.5.0

 */
Web2Cal.defaults = {
    /**
     Denotes the start-of-week. 0 represents Sunday. Can be any value from 0-6
     @property startOfWeek
     @type Number
     @default 0
     **/
    startOfWeek:          0,
    /**
     Log level to indicate DEBUG, INFO, ERROR
     @property loglevel
     @type Number
     @default 100
     **/
    loglevel:             100,
    /**
     Property to indicate if view should automatically scroll to current time or the earliest event or no scroll.
        Values are
        <ul>
     <li>EVENT</li>
     <li>NOW</li>
     <li>BLANK</li>
     </ul>
     @property scrollViewTo
     @type String
     @default EVENT
     **/
    scrollViewTo:          "EVENT",
    /**
     Web2Cal allows you to display all or only a subset of the views mentioned above. By Default web2cal will display all the views. You can provide the list of views to web2cal during initialization. Following code will display only Day, Week and Month view.
     @property views
     @type String
     @default "month,week,day,workshift,  scheduler,agenda,w2cview"
     **/
    views:                "month,week,day,workshift,scheduler,agenda,w2cview",
    /**
     A default view is the view displayed on page load. You can specify a default view when you initialize the calendar.
     @property defaultView
     @type String
     @default "week"
     **/
    defaultView:         "week",
    /**
     ID of the div element to be shown on creation of the new event when in month view.

     <strong>Note:</strong>
     Web2Cal supports a seperate template for each view. The following templates can be used for various views
     <br/>
     weekNewEventTemplate - week, day view <br/>
     wsNewEventTemplate - workshift view<br/>
     w2cNewEventTemplate - w2cView<br/>

     @example
        newEventTemplate: "myNewEventTemplate"

     @property newEventTemplate
     @type String
     @default "defaultNewEventTemplate"
     **/
    newEventTemplate:     "defaultNewEventTemplate",
    /**
     ID of the div element to be shown when user clicks on an event.

     <strong>Note:</strong>
     Web2Cal supports a seperate template for each view. The following templates can be used for various views
     <br/>
     weekPreviewTemplate - week, day view <br/>
     wsPreviewTemplate - workshift view<br/>
     w2cPreviewTemplate - w2cView<br/>

     @example
     previewTemplate: "previewTemplate"

     @property previewTemplate
     @type String
     @default "previewTemplate"
     **/
    previewTemplate:      "previewTemplate",
    //dataTemplate:         "",
    //maxEventsToShow:     7 ,
    //date:                new Date() ,
    //renderMode:          "default" ,
    //workWeekStart:       0 , //Mon
    //workWeekLength:      5 ,
    //showTodayButton:     true ,

    /**
     Start time of calendar.

     Number 0 through 24. Number must be lesser than endTime Minutes are not supported at this time.


     @property startTime
     @type Number
     @default 0
     **/
    startTime:           0 ,
    /**
     End time of calendar.

     Number 1 through 24. Number 0 through 24. Number must be greater than startTime Minutes are not supported at this time.


     @property endTime
     @type Number
     @default 24
     **/
    endTime:             24 ,
    /**
     The Custom View size. The Next "X" Number of days view
     12 or 24
     @property customViewSize
     @type Number
     @default 4
     **/
    customViewSize:      4 ,

    //adjustHeightOffset:  0 ,

    /**
     Format in which time needs to be displayed

     @property timeFormat
     @type Number
     @default 12
     **/
    timeFormat:          12 ,

    /**
     Slot height in pixels for Week View
     Height in pixels. No Units, just number of pixels.
     @property dwSlotHeight
     @type Number
     @default 43
     */
    dwSlotHeight:        43 ,

    /**
     Specify, if the data needs to be offset by any number of minutes.
     Offset in Minutes. Example: 240 if server is in east coast.

     @property timeZoneOffset
     @type Number
     @default 0
     */
    timeZoneOffset:      0   ,



    /**
     Width of Web2Cal
     Width in percentage or Pixels. Include the units

     @property controlWidth
     @type string
     @default "100%"
     */
    controlWidth:        '100%' ,
    /**
     Height of Web2Cal
     Height in percentage or Pixels. Include the units

     @property controlHeight
     @type string
     @default "100%"
     */
    controlHeight:       '500px' ,

    /**
     Indicates if left navigation with minicalendar and quick filter should be displayed

     @property showLeftNav
     @type boolean
     @default true
     */
    showLeftNav:         true ,

    /**
     Indicates if  all-day events should be displayed week/day view.
     @property showAllDay
     @type boolean
     @default true
     */
    showAllDay:          true ,

    /**
     Indicates if quick filter should be displayed
     @property showQuickFilter
     @type boolean
     @default true
     */
    showQuickFilter:     true ,
    /**
     Indicates if Quick Add Event Link should be displayed. If this link is hidden, the only way to create a new event would be to use the mouse to click and drag on the calendar.
     @property showQuickAdd
     @type boolean
     @default true
     */
    showQuickAdd:        true ,

    //showOptions:         false ,
    //disableRightClick:   true ,
    //newEventInPopUp:     false ,
    //wsGroupUnselectable:  false ,
    /**
     This option applies to the workshift view only. Specifies the start time to be displayed on the horizontal time bar
     @property wsStartTime
     @type Number
     @default 9
     */
    wsStartTime:         9 ,
    /**
     This option applies to the workshift view only. Specifies the end time to be displayed on the horizontal time bar
     @property wsEndTime
     @type Number
     @default 24
     */
    wsEndTime:            24 ,
    /**
     This option applies to the workshift view only. Specifies the interval between each slot.
     @example:
        2 = show 30 minute intervals
     @property wsInterval
     @type Number
     @default 2
     */
    wsInterval:           2 ,
    /**
     This option applies to the workshift view only. Specifies the width of the left column where the names appear
     @property wsNameWidth
     @type Number
     @default 100
     */
    wsNameWidth:          100 ,
    /**
     This option applies to the workshift view only. Specifies the height of each name or slot
     @property wsSlotHeight
     @type Number
     @default 55
     */
    wsSlotHeight:         55 ,
    /**
     Specifies the interval between each slot.
     @example:
        4 = show 15 minute intervals
     @property interval
     @type Number
     @default 2
     */
    interval:             2 ,
    /**
    length of a new event when clicked.

     @property newEventLength
     @type Number
     @default 120
     */
    newEventLength:       120,
 //   monthNewEventTemplate:"defaultNewEventTemplate",
 //   weekNewEventTemplate: "defaultNewEventTemplate",
 //   w2cNewEventTemplate:  "defaultNewEventTemplate",
//    wsNewEventTemplate:   "defaultNewEventTemplate",

    /**
     ID of the div element to be shown on the calendar for events. When in week, day view.

     @property weekDataTemplate
     @type String
     @default dayWeekEventTemplate
     */
    weekDataTemplate:    "dayWeekEventTemplate",
    /**
     ID of the div element to be shown on the calendar for events. When in resource view.

     @property w2cDataTemplate
     @type String
     @default dayWeekEventTemplate
     */
    w2cDataTemplate:     "dayWeekEventTemplate",
    /**
     ID of the div element to be shown on the calendar for events. When in resource view.

     @property w2cDataTemplate
     @type String
     @default dayWeekEventTemplate
     */
    monthDataTemplate:   "monthEventTemplate",
    /**
     ID of the div element to be shown on the calendar for events. When in workshift view.

     @property wsDataTemplate
     @type String
     @default workshiftEventTemplate
     */
    wsDataTemplate:      "workshiftEventTemplate",
    /**
     ID of the div element to be shown on the calendar for events. When in Agenda view.

     @property agendaDataTemplate
     @type String
     @default agendaViewTemplate
     */
    agendaDataTemplate:  "agendaViewTemplate",
 //   weekPreviewTemplate:  "previewTemplate",
 //   wsPreviewTemplate:   "previewTemplate",
 //   monthPreviewTemplate: "previewTemplate",
 //   w2cPreviewTemplate:  "previewTemplate",
    /**
     ID of the div element to be shown on the calendar for events. When in Agenda view.

     @property agendaDataTemplate
     @type String
     @default agendaViewTemplate
     */
    quickFilterTemplate: "quickFilterTemplate",
    /**
     ID of the div element to be shown on the calendar for events. When in Month view.

     @property monthAllDayTemplate
     @type String
     @default monthAllDayTemplate
     */
    monthAllDayTemplate: "monthAllDayTemplate",
    /**
     <p>
     This callback function is invoked when user is creating an event by either dragging on the calendar grid or clicking Quick Add on the calendar.
     Use this function to display a form to collect  information for an event. Pre-populate the start time and end time in the form with the start and end returned in the event object.
     </p>
     <strong>Note:</strong>
     There is one specific callback function for each view.
        With Web2Cal 2.0 or greater, you can specify one generic onNewEvent callback for all views.
     <br/>
     <br/>
     <strong>weekOnNewEvent</strong> - For Week View<br/>
     <strong>wsOnNewEvent</strong> - For Workshift View<br/>
     <strong>agendaOnNewEvent</strong> - For Agenda View<br/>
     <strong>monthOnNewEvent</strong> - For Month View<br/>
    <p>
     <strong>Parameters are</strong><br/>
     <strong>event</strong> - Object. Event object contains the start time and end time of the event.<br/>
     <strong>groups</strong> - Array. List of group objects. (Provided for convenience)<br/>
     <strong>allDay</strong> - boolean. Indicates if the user tried to create an all day event.<br/>
    </p>

     @property onNewEvent
     @type function
     @default null
     */
    onNewEvent: 		    null,
    /**
     <p>
     This function is invoked when user drags an event to change its date and time.
     Typical use of this function will be to persist the new date and time for the event. Once the database is updated,  you must, update it in Web2Cal's cache as well. This is done by invoking updateEvent on Web2Cal API. For more information on updateEvent click here.
     </p>
     <strong>Note:</strong>
     There is one specific callback function for each view.
     With Web2Cal 2.0 or greater, you can specify one generic onNewEvent callback for all views.
     <br/>
     <br/>
     <strong>weekOnNewEvent</strong> - For Week View<br/>
     <strong>wsOnNewEvent</strong> - For Workshift View<br/>
     <strong>agendaOnNewEvent</strong> - For Agenda View<br/>
     <strong>monthOnNewEvent</strong> - For Month View<br/>
     <p>
     <strong>Parameters are</strong><br/>
     <strong>event</strong> - Object. The event object that is being dragged. Note: If an event object contains many custom fields, all those fields will be provided. Not just the new date and time. .<br/>
     </p>

     @property onUpdateEvent
     @type function
     @default null
     */
    onUpdateEvent: 	    null,
    /**
     <p>
     This function is responsible to provide the data to be displayed.
     This function is invoked after the calendar is rendered for the first time and also every time the view is changed.     </p>
     <strong>Parameters are</strong><br/>
     <strong>startDate</strong> - Date - The start of the range of dates currently displayed <br/>
     <strong>endDate</strong>  - Date - The end of the range of dates currently displayed. <br/>
     <strong>viewName</strong>  - String - The name of the view currently being displayed. <br/>
     <i>One of day, week, month, workshift, w2cview, agenda, custom</i>

     @property loadEvents
     @type function
     @default null
     */
    loadEvents:		    null,


    /**
     Automatically switch to mobile mode when rendered on a smaller screen.
     @property autoDetectMobileMode
     @type boolean
     @default true
     */
    autoDetectMobileMode: true,
    /**
     Fills up the page if the following is turned on to true.
     @property autoDetectMobileMode
     @type boolean
     @default false
     */
    mobileModeFillWindow: false,
    /**
    Indicates if calendar should reload and re-render if window is resized

     @property reloadOnResize
     @type boolean
     @default true
     */
    reloadOnResize:      true,
    /**
    When a large number of events are displayed in all day section in week view, this property will collapse all events to a line.

     @property collapseByDefault
     @type boolean
     @default true
     */
    collapseByDefault:      true,


    /**
     <p>
     This method is a window to control the behavior of event preview being displayed. If you implement this function, you must explicitly call showPreview on Web2Cal API to display the preview. Click here for more information on showPreview method.
     <p><strong>Note:</strong>
     Implementing this method is optional. If you do no specify this method, Web2Cal will implicitly convert the preview with event's information and display.
     There is a unique onPreview function for each view in Web2Cal. There is a specific callback for each view in the calendar. So, the following callbacks are similar to this one.</p>
     <br/>
     <strong>monthOnPreview</strong> - For Month View<br/>
     <strong>wsOnPreview</strong> - For Workshift View<br/>
     <strong>agendaOnPreview</strong> - For Agenda View<br/>
     <strong>w2cOnPreview</strong> - For w2c View<br/>
     With Web2Cal premium 2.0 onwards, you can just specify a generic "onPreview" callback for all views.     This function is invoked when user clicks on any event that is being displayed in the calendar.
     </p>

     <p>
     <strong>Parameters are</strong><br/>
     <strong>calEvent</strong> - Dom Object - This is the event that user clicked on.<br/>
     <strong>event</strong> - Object - This is the entire event data object.<br/>
     </p>

     @property onPreview
     @return void
     @type function
     @default null
     */
    onPreview: null
};



