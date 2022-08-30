/**
 * class web2cal
 */

/**
 * Utility function. Invoked when creating a new event. Populates Date fields.
 * Loads the list of categories (groups). If event is all day, Changes time automatically.
 *
 * @method onNewEvent
 * @param {Object} obj - Event
 * @param {Object} groups - List of groups
 * @param {Object} allday - Boolean to indicate if event is all day
 *
 */
Web2Cal.onNewEvent=function($form,obj, groups, allday)
{

    $form.addClass("minimode").find(":input").val("").end()
        .find("#eventStartDate").val( obj.startTime.toString("MM/dd/yyyy")).end()
        .find("#eventEndDate").val(obj.endTime.toString("MM/dd/yyyy")).end()
        .find("#addEventBtn").show().end()
        .find("#updateEventBtn").hide().end();

    var diffDate = (obj.startTime.getDate()!=obj.endTime.getDate()) ? true : false;

    if(allday){
        $form.find("#allDayEvent").attr("checked", true).end()
            .find("#eventStartTime").val("").end()
            .find("#eventEndTime").val("").end();
        if( diffDate )
            $form.find(".ev-time-summary").html( obj.startTime.toString("ddd, MMM d")
                +" - "+obj.endTime.toString("ddd, MMM d") );
        else
            $form.find(".ev-time-summary").html( obj.startTime.toString("ddd, MMM d") );

    }else{
        $form.find("#allDayEvent").attr("checked", false).end()
            .find("#eventStartTime").val( obj.startTime.toString("h:mm tt") ).end()
            .find("#eventEndTime").val( obj.endTime.toString("h:mm tt")).end()
            .find(".ev-time-summary").html( obj.startTime.toString("ddd, MMM d") +", "+obj.startTime.toString("h:mm tt") +" to "+ obj.endTime.toString("h:mm tt") );
    }
    //display a list of groups to select from.
    $form.find("#eventGroup").empty();
    for(var g in groups)
    {
        if(!groups.hasOwnProperty(g))continue;
        var grp = groups[g];
        $form.find("#eventGroup").append('<option value="'+grp.groupId+'">'+grp.name+'</option> ')
    }
    if(obj.group && obj.group.groupId)
        $form.find("#eventGroup").val(obj.group.groupId);

    // newevt.find("#eventName").focus();
}
/**
 * Utility Function. Reads user's input into New Event form.
 * Constructs an object with a random event id and returns
 *
 * @return Event Object
 */
Web2Cal.getNewEventObject=function($form)
{

    var name=$form.find( "#eventName").val();

    if(name=="")
    {
        name="No Title";
    }

    var start	=	getDateFromStrings($form.find("#eventStartDate").val(), $form.find("#eventStartTime").val());
    var end		=	getDateFromStrings($form.find("#eventEndDate").val(), $form.find("#eventEndTime").val());
    var allDay = false;
    if($form.find("#allDayEvent").length && $form.find("#allDayEvent").get(0).checked)
    {
        start.clearTime();
        end.clearTime();
        allDay=true;
    }
    return {name: name
        ,  startTime:start
        , endTime:end
        , allDay: allDay
        , group:{groupId:$form.find("#eventGroup").val(), name: $form.find("#eventGroup  option:selected").text()}
        , eventId: Math.ceil(999*Math.random())
        , description: $form.find("#eventDescription").val()
    };
};

Web2Cal.showMoreInfo = function(link){
    var count= 0, $jq = jQuery(link);
    while(count++ <6  && !$jq.is(".web2cal-form")){
        $jq = $jq.parent();
    }

    $jq.removeClass("minimode");
}


/**
 * Click of Add in add event box.
 */
function rzAddEvent() {
    var newev = Web2Cal.getNewEventObject(jQuery("#defaultNewEventTemplate"));
    ical.addEvent(newev);
}

function addMobileEvent() {
    var newev = Web2Cal.getNewEventObject(jQuery("#newEventFormMobile"));
    ical.addEvent(newev);
    Web2Cal.PageHandler.goToCalendar();
}

function updateMobileEvent() {
    var updEv = Web2Cal.getNewEventObject(jQuery("#newEventFormMobile"));
    updEv['eventId']=activeEvent.eventId;
    // PageHandler.showPage(jQuery("#eventPreviewMobile"), jQuery("#newEventFormMobile") );
    // jQuery("#defaultNewEventTemplate").hide();
    ical.updateEvent(updEv);
}

/**
 * Utility function to create date object from date string and time string
 * @param dateString - Date String mm/dd/yyyy
 * @param timeString - Time String HH:MM AM/PM
 * @return number Object
 */
function getDateFromStrings(dateString, timeString)
{
    var dt = Date.parse(dateString + " "+timeString);
    return dt;
}
/**
 * Creates default HTML Elements required by calendar.
 * All templates can be overwritten in the HTML document and ID of the element can be provided to Web2Cal.
 *
 * @param {Object} opts
 */
Web2Cal.loadDefaultTemplates=function($container, opts)
{
    var options = opts || new Array();
    var createWeekEventTemplate=function()
    {

        var _html='<div class="calendarTemplate"  id="dayWeekEventTemplate" style="display:none;"> '
            +''
            +' <div class="hdr ${status.code}" style="">'
            +' 	${formattedStartTime} - ${formattedEndTime}'
            +' </div>	'
            +' <div class="body"  style="padding:1px;">'
            +' 	${eventName}'
            //     +' 	<div class="location">${location}</div>'
            +' </div> '
            +''
            +' </div>';
        return _html;
    }
    var createRecurEventOptions=function() {
        var _html='	'
            +'<div id="editRecurEventOptions" class="wmodal" > '
            +'	<P>'
            +       Web2Cal.LANG.LABEL_EDIT_RECUR_EVENT_DESC
            +'	</P>'
            +'	<div style="text-align: center;"> <input type="button" tabindex="1" class="button" value="Only this instance" id="recurEvent_SAVEONE" />'
            +'	<input type="button"  class="button" value="All events in the series" id="recurEvent_SAVEALL" />'
            +'	<input type="button"  class="button" value="Cancel" id="recurEvent_CANCEL" />'
            +'  </div>'
            +'</div>';
        return _html;
    }
    var createWeekSlotTemplate= function() {
        var _html='<div class="calendarTemplate"  id="wsSlotTemplate" style="display:none;"> '
            +'		<div>'
            +'			${name}  '
            +'		</div>'
            +'	</div>';
        return _html;
    }
    var createMonthEventTemplate=function() {
        var _html='<div class="calendarTemplate"  id="monthEventTemplate" style="display:none;"> '
            +'			<div class="evContent">'
            +'					${formattedStartTime} - ${name}'
            +'			</div>	'
            +'	</div>';
        return _html;
    }
    var createWorkshiftTemplate=function() {
        var _html = '<div class="calendarTemplate"  id="workshiftEventTemplate" style="display:none;"> '
            +'<div class="hdr" style="">'
            +'	${formattedStartTime} - ${formattedEndTime}'
            +'</div>	'
            +'<div class="body"  style="padding:1px;">'
            +'	${name}   '
            +'</div> '
            +'</div>';
        return _html;
    }
    var createDefaultPreview = function()
    {
        var _html='<div id="previewTemplate"  class="  calComponent    "  >'
            +'<a class="close" href="javascript:void(0)" onclick="Web2Cal.hidePreview()">x</a>'
            +'		<div class="aPointer p-left" style="display: block; z-index: 2; "></div>'
            +'		<h3>${eventName}</h3>'
            +'			<div class="control-group"> <label>start: </label> <div class="controls">${_formattedStartDate} ${formattedStartTime}</div></div>'
            +'			<div class="control-group"><label>end: </label> <div class="controls">${_formattedEndDate} ${formattedEndTime}</div></div>'
            +'			<div class="control-group"><label>description: </label> <div class="controls">${description}</div></div>'
            +'			<div class=""><div style="color:#aaa; float:right">EventID: ${eventId}</div></div>'
            +'			<div class="control-group"><label>color: </label>'
            +'			<div class="controls eventcolors" >' +
            '               <div class="greenTemplate"></div>' +
            '               <div class="blueTemplate"></div>' +
            '               <div class="grayTemplate"></div>' +
            '               <div class="tealTemplate"></div>' +
            '               <div class="brownTemplate"></div>' +
            '               <div class="lightGreenTemplate"></div>' +
            '               <div class="dirtyPinkTemplate"></div>' +
            '               <div class="purpleTemplate"></div>' +
            '               <div class="cyanTemplate"></div>' +
            '               <div class="brickTemplate"></div>' +
            '               <div class="lightPurpleTemplate"></div>' +
            '               <div class="brightGreenTemplate"></div>' +
            '               <div class="dirtyYellowTemplate"></div>' +
            '               <div class="brighBlueTemplate"></div>' +
            '               <div class="pinkTemplate"></div>' +
            '           </div> <div class="clearfix"></div> ' +
            '  </div>'
            +'		<div class="well">'
            +'			<a href="javascript:rzEditEvent(\'${eventId}\');"  class="btn ">Edit</a>'
            +'			<a href="javascript:rzDeleteEvent(\'${eventId}\');"  class="btn btn-danger">Delete</a>'
            +'		</div>'
            +' </div>';
        return _html;
    }
    var createMonthAllDayTemplate=function()
    {
        var _html='<div class="calendarTemplate calComponent"  id="monthAllDayTemplate" >'
            //+'			<span>${formattedStartTime}</span> - <span>${formattedEndTime}</span>	'
            //+'			<span>${eventName}</span>'
                        +'<div class="alldayevent"></div>@@@@ ${eventName}'
            +'</div>';
        return _html;
    }

    var createQuickFilterTemplate=function()
    {
        var _html='<div id="quickFilterTemplate" style="display:none;">'
            +'	<div class="grp">'
            +'		<div class="filterBoxColor  ${color.css}">A</div>'
            +'		<label class="checkbox"><input type="checkbox" id="chkGrp${groupId}" value="${groupId}" class="grpChkBx">${name}</label>'
            +' </div>'
            +'</div>';
        return _html;
    }
    var createNewEventTemplate = function()
    {
        var _html='<div id="defaultNewEventTemplate" class="absPosition web2cal-form minimode calComponent calendarTemplate   ">	'
            +'	<div class="aPointer p-left " ></div> 	'
            +'	<div class="ev-time-summary in-mini-mode"></div>'
            +'   <h4 class="in-max-mode">	'
            +'		Create New Event	'
            +'	</h4>	'
            +'  <a class="in-mini-mode" onclick="Web2Cal.showMoreInfo(this);" style="float:right;font-size:75%; " href="javascript:void(0)">Add More Detail</a>'
            +'	 <label>Name: </label>'
            +'	 <input type="text" name="eventName" style="width:95%;" id="eventName"> '
            +'  <div class="clearfix"></div> '
            + '  <label style="float: left;" class="in-max-mode">Time: </label> ' +
            '	 <label style="float: right;" class="in-max-mode">All Day?<input type="checkbox"   id="allDayEvent"/></label>'
            +'	 <div class="value in-max-mode" style="clear:both;">'
            +'		 <input type="Text" name="eventStartDate" style="width:6em;" id="eventStartDate"/>'
            +'		 <input type="Text" name="eventStartTime" style="width:5em;" id="eventStartTime"/>'
            +'		 <input type="Text" name="eventEndDate" style="width:6em;" id="eventEndDate"/>'
            +'		 <input type="Text" name="eventEndTime" style="width:5em;" id="eventEndTime"/>'
            +'	 </div>'
            +' <label style="margin-top:15px;display:inline-block;; ">Group: </label>'
            +'	 <select style="" name="eventGroup" id="eventGroup"></select>'
            +'	 <label style="clear:both; margin-top: 15px;" class="in-max-mode">Description: </label>'
            +'	 <textarea id="eventDescription" class="in-max-mode"  style="width:100%;height:3em;"  ></textarea> '
            +'	<div class="well"><a href="javascript:rzAddEvent();" id="addEventBtn"   class="btn">Save</a>  '
            +'	<a href="javascript:rzUpdateEvent();" id="updateEventBtn"  class="btn " style="display:none;">Update</a> '
            +'	<a href="javascript:Web2Cal.closeAddEvent();"  class="btn">Close</a></div>'
            +'</div>';
        return _html;
    }

    var createAgendaTemplate=function()
    {
        var _html=''
            +'<div class="calendarTemplate"  id="agendaViewTemplate" style="display:none;">'
            +'	<div class="agendaDateEvents">' +
            '              <div class="date"> <h2>${date}</h2> </div> <div class="   agendaEventsForDate"><div field="events" >' +
            '                   <div class="agendaViewEvent" id="agendaViewEvent${eventId}${_localId}">'
            +'							<div class="arrowExpand evtDtlArrowIcon" id="eventIcon${eventId}${_localId}"></div>'
            +'							<div class="${color.css} colorbox"> </div><a href="javascript:void(0)"  onclick="agendaShowEventDetail(\'${eventId}${_localId}\')">${eventName}</a>'
            +'							( ${formattedStartTime} - ${formattedEndTime} )  '
            +'							'
            +'	<div id="eventDetail${eventId}${_localId}" class="agendaEventDetail   ${className}" style="display:none;clear:both;">'
            +'		<div class="row"> <label>From: </label> <div class="input">${_formattedStartDate} ${formattedStartTime}</div>'
            +'		</div>	'
            +'		<div class="row">	'
            +'			<label>To: </label>'
            +'			<div class="input">${_formattedEndDate} ${formattedEndTime}</div>'
            +'		</div>	'
            +'		<div class="row">	'
            +'			<label>Description: </label>'
            +'			<div class="input">${description}</div>'
            +'		</div>	'
            +'		<div class="well">'
            +'			<a  href="javascript:void(0)" class=" btn small" id="agendaEditBtn${eventId}" onclick="rzEditEvent(\'${eventId}\', event)">Edit</a>'
            +'			<a  href="javascript:void(0)" class="btn  small" id="agendaDeleteBtn${eventId}"  onclick="rzDeleteEvent(\'${eventId}\', event)" >Delete</a>'
            +'		</div>'
            +'	</div>'

            +'	                </div>'
        '               </div> ' +
            '               </div> ' +
            +'	</div>'
        +'</div> ';

        return _html;
    }
    var createMobileNewEventTemplate = function(){
        return '<div id="newEventFormMobile" class="mobile-form app" style="display:none"> '+
            ' <div class="top-bar"> '+
            '  <a href="#" onclick="Web2Cal.PageHandler.goBack()"  class="top-bar-link left glyph-back">Back</a> '+
            '  <a class="top-bar-link right" id="addEventBtn" onclick=" addMobileEvent() ">Done</a> '+
            '  <a href="#" class="top-bar-link right" id="updateEventBtn"  style="display:none;" onclick="Web2Cal.PageHandler.goBack(2, function(){updateMobileEvent()}); ">Update</a> '+
            '  <h1 class="top-bar-title">Create Edit Event</h1> '+
            '  </div> '+
            '  <div class="content"> '+
            '    <form> '+
            '        <h2 class="form-title-row">Event Information</h2> '+
            '        <fieldset> '+
            '            <label class="form-row form-text-row"><span class="form-text-label">Name:</span><input type="text" id="eventName" class="form-text-input" placeholder="Event Name..."></label> '+
            '            <label class="form-row form-text-row"><span class="form-text-label">Starts:</span><input  class="form-text-input border"  id="eventStartDate" placeholder="Start Date" style="width:8em; " type="text" ><input  class="form-text-input border width-30" id="eventStartTime" placeholder="Start Time"  type="text" ></label> '+
            '            <label class="form-row form-text-row"><span class="form-text-label">Ends:</span><input  class="form-text-input"  placeholder="End Date" type="text"  id="eventEndDate" style="width:8em; "><input  class="form-text-input border width-30"  placeholder="End Time" type="text" id="eventEndTime"  ></label> '+
            '            <label class="form-row form-select-row"><span class="form-text-label">Calendar:</span><select class="form-select-input" id="eventGroup"><option></option> </select> </label> '+
            '            <label class="form-row form-text-row"><textarea class="form-text-textarea" placeholder="Notes…"></textarea></label> '+
            '       </fieldset> '+
            '   </form> '+
            '   </div> '+
            '</div>';
    }
    var createMobilePreviewTemplate = function(){
        return '<div id="eventPreviewMobile" class="mobile-form app" style="display:none"> ' +
            '    <div class="top-bar"> ' +
            '       <a href="#" onclick="Web2Cal.PageHandler.goBack()"  class="top-bar-link left glyph-back">Back</a> ' +
            '       <a class="top-bar-link right" id="editEventBtn" onclick="rzEditEvent(\'${eventId}\')">Edit Event</a> ' +
            '       <h1 class="top-bar-title">Event Details</h1> ' +
            '   </div> ' +
            '       <div class="content"> ' +
            '           <form> ' +
            '               <h2 class="form-title-row">Event Information</h2> ' +
            '               <fieldset> ' +
            '                   <label class="form-row form-text-row"><span class="form-text-label">Name:</span>${eventName}</label> ' +
            '                   <label class="form-row form-text-row"><span class="form-text-label">Starts:</span>${_formattedStartDate} ${formattedStartTime}</label> ' +
            '                   <label class="form-row form-text-row"><span class="form-text-label">Ends:</span>${_formattedEndDate} ${formattedEndTime}</label> ' +
            '                   <label class="form-row form-select-row"><span class="form-text-label">Calendar:</span><select class="form-select-input" id="eventGroup"><option></option></select></label> ' +
            '                    <label class="form-row form-text-row">${description}</label> ' +
            '               </fieldset> ' +
            '                  <div class="form-submit"><button type="button" onclick="rzDeleteEvent(\'${eventId}\');" class="button button-red icon-delete">Delete Event</button></div> ' +
            '               </form> ' +
            '       </div> ' +
            '   </div> ';

    }
    $container.append(createWeekEventTemplate())
        .append(createWeekSlotTemplate())
        .append(createMonthEventTemplate())
        .append(createDefaultPreview())
        .append(createWorkshiftTemplate())
        .append(createRecurEventOptions())
        .append(createQuickFilterTemplate())
        .append(createMonthAllDayTemplate())
        .append(createAgendaTemplate())
        .append(createMobileNewEventTemplate())
        .append(createMobilePreviewTemplate())
        .append(createNewEventTemplate());

}

Web2Cal.getCalendarCanvas = function(){
    var str =
        '<div id="loadingBlock" ></div>' +
            '  <div class="web2cal"  unselectable="on" >' +
            //     '    <div class="note" id=""><div class="closebtn">x</div><div class="txt"> some info</div></div>'+
            '    <div id="inner-wrap"  >'+
            '	       <div class="leftNav"   id="leftNav">' +

            '			<div class="quickAddLink rw"> <a href="javascript:void(0)" class="cal-link">' +	Web2Cal.LANG.LABEL_CREATENEWEVENT +	'</a></div> ' +
            '			<div  class="minicalContainer"><div id="minical" class="minical"></div></div> ' +
            '			<div class="leftNavGroupsList" id="leftNavGroupsList">' +
            '				<div class="leftNavContent">			' +
            '					<div class="hdr"><a class="new-group rw" href="javascript:void(0)">' +	Web2Cal.LANG.LABEL_CREATENEWGROUP +	'</a>' + Web2Cal.LANG.LABEL_HIDESHOW +	'</div>' +
            '					<div class="data"></div>' +
            '				</div>' +
            '			</div>' +
            '			</div>' +
            '		<div id="calendarContent"  >  	' +
            '			<div id="topnavContainer" class="topnavContainer" >' +
            '               <div class="inline r1">' +
            '			<a class="nav-btn" id="nav-open-btn" href="javascript:void(0)"></a>    ' +
            '                   ' +
            '			        <a class=" toggle-month-list"   href="javascript:void(0)"></a>    ' +
            '			        <a class=" settings-btn"   href="javascript:void(0)"></a>    ' +
            '		    		<ul class="calnav" id="calNavData">' +
            '			    	</ul>' +
            '   				<div class="controlsContainer" >' +
            '   						<div id="calControl" class="calControl " ></div>' +
            '   				</div>' +
            '   				<a id="topQuickAddContainer" href="javascript:void(0)" class="rw calendar-link quickAddLink">' +	Web2Cal.LANG.LABEL_CREATENEW +	'</a>' +
            '                   <a href="javascript:void(0)" class="topHideShowLink ">' + Web2Cal.LANG.LABEL_HIDESHOW + '</a> ' +
            '               </div>'+
            '               <div class="inline r2">' +
            '                   <div class="collapse-left-nav icon-arrow-left"></div>'+
            '                    <ul class="calnav">' +
            '                           <li><a href="javascript:void(0);" class="prevButton navbtn" title="'+Web2Cal.LANG.LABEL_PREVIOUS+'">'+Web2Cal.LANG.LABEL_PREVIOUS_BTN+'</a></li>'+
            '                           <li><a href="javascript:void(0);"   class="nextButton navbtn" title="'+Web2Cal.LANG.LABEL_NEXT+'">'+Web2Cal.LANG.LABEL_NEXT_BTN+'</a></li>'+
            '                    </ul>' +
            '                   <span class="icon-calendar"></span><div id="calTitle" class="calTitle "></div>'+
            '               </div>'+
            '			</div>		' +
            '			<div class="plotterContent" >' +
            '               <div id="viewSpecNav"></div> ' +
            '				<div class="calheaderContainer" id="calheaderContainer"> ' +
            '				</div> ' +
            '				<div class="calheaderContainer" id="calsubheaderContainer" > ' +
            '				</div> ' +
            '				<div class="allDayContainer" id="allDayContainer" style="position:relative;">' +
            '					<div class="folderPlus" id="allDayExpandCollapse">&nbsp;</div>'+
            '					<div class="allDayEventContainer" id="allDayEventContainer"><div>&nbsp;</div>				' +
            '					</div>' +
            '					<div class="allDayGridContainer" id="allDayGridContainer">' +
            '					</div>' +
            '				</div> ' +
            '			<div class="calbodyContainer" id="calbodyContainer">' +
            '					<div id="fixedSlots" style="position:absolute;top:0px; left:0px;"></div>'+
            '				<table  cellspacing="0" cellpadding="0" border="0"  style=" width: 100%; height:100%;">' +
            '						<td  valign="top" class="gridYContainerTD" id="gridYContainerTD"> ' +
            '							<div class="gridYContainer" id="gridYContainer">				' +
            '							</div> ' +
            '						</td>' +
            '						<td valign="top" id="gridXContainerTD">					 ' +
            '							<div class="gridContainer" id="gridContainer">' +
            '								<div class="gridCanvas" id="gridCanvas">	' +
            '								</div>' +
            '								<div class="grid" id="grid">' +
            '								</div>' +
            '							</div>' +
            '						</td>' +
            '					</table>' +
            '			</div>' +
            '				<div class="calfooter">' +
            '				</div>' +
            '			</div>' +
            '		</div>		' + // end of calContent
            '   </div>'+ // end of inner-wrap
//            ' 		<div style="display:none;">Powered by web2cal. <a href="http://www.web2cal.com">Building Ajax Events Calendar</a> made easy.</div>' +
        '		<div id="statusMsg" class="calStatus"><div class="closebtn"></div><div class="header">'+Web2Cal.LANG.LABEL_INFORMATION +'</div><div class="body"></div></div>' +
        '	</div>'	+ //Web2Cal Close...
        ' '+
        '';
   // '</div>';
    return str;
}




function removeAllOptions(from){if(!hasOptions(from)){return;}for(var i=(from.options.length-1);i>=0;i--){from.options[i] = null;}from.selectedIndex = -1;}
function addOption(obj,text,value,selected){if(obj!=null && obj.options!=null){obj.options[obj.options.length] = new Option(text, value, false, selected);}}
function hasOptions(obj){if(obj!=null && obj.options!=null){return true;}return false;}

function updateDateForTime(time, opts, prevTime)
{
    var incrementAmt;
    if(time=="12:00 AM" && prevTime!="12:00 AM") //don't increment again and again.. only if user has changed increment
    {
        var df=opts.dateField; //get date field
        if(df)
        {
            incrementAmt =1;
        }
    }
    else if(prevTime=="12:00 AM" && time!="12:00 AM")
    {
        var df=opts.dateField;
        if(df)
        {
            incrementAmt = -1;
        }
    }
    if (incrementAmt) {
        var value = jQuery(opts.dateField).val();
        var dt = Date.parse(value).addDays(increment)
        dfObj.value = dt.toString("mm/dd/yyyy");
    }
}

function extractEventColor(obj, template)
{
    if(!obj || !template) return "";
    return "<div class='colorbox "+obj.color.css+"'><div class='filterBoxColor'></div></div>";
}
function agendaShowEventDetail(evId)
{
    jQuery("#eventDetail"+evId).toggle();
    if(jQuery("#eventIcon"+evId).hasClass("arrowCollapse"))
    {
        jQuery("#eventIcon"+evId).removeClass("arrowCollapse").addClass("arrowExpand");
        jQuery("#agendaViewEvent"+evId).removeClass("highLightAgendaEvent");
    }
    else
    {
        jQuery("#eventIcon"+evId).removeClass("arrowExpand").addClass("arrowCollapse");
        jQuery("#agendaViewEvent"+evId).addClass("highLightAgendaEvent");
    }
}
function agendaExpandAllDetails()
{
    jQuery("div.agendaEventDetail").show();
    jQuery(".evtDtlArrowIcon").removeClass("arrowExpand").addClass("arrowCollapse");
    jQuery(".agendaViewEvent").addClass("highLightAgendaEvent");
}

function agendaCollapseAllDetails()
{
    jQuery("div.agendaEventDetail").hide();
    jQuery(".evtDtlArrowIcon").removeClass("arrowCollapse").addClass("arrowExpand");
    jQuery(".agendaViewEvent").removeClass("highLightAgendaEvent");
}
 