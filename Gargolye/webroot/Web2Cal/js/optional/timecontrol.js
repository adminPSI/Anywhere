/**
 ------------------------------------------------------------------------------------------------------------
 * Crize component to ---------------------------------------
 * This file contains both original and merged/adapted code.
 * Except where indicated, all code is
 * Copyright (c) 2008 Suresh Solomon  All Rights Reserved.
 * User: ss68956
 * Date: 5/4/12
 * Time: 4:48 PM
 * Version 1.0
 * DO NOT CHANGE THE FOLLOWING CODE. YOU WILL LOOSE YOUR CHANGES, COZ ITS GENERATED
 -----------------------------------------------------------------------------------------------------------
 */

/**
 * TimeControl makes entering time as easy and natural as possible.
 * <p>TimeControl can be easily attached to any text box. The goal was to allow user edit or select time from list.</p>
 * @class Web2Cal.TimeControl
 *
 * @Constructor
 * @param {Object} control - The TextBox Input object that needs to support Time Control
 * @param {Object} fromTime - <p>The Text Box Object. Typically, this param is required for the end Time box.
 * 					The control will automatically compute and display the length of the event
 * 					Pass null when it does not apply</p>
 * @param {Object} options
 *          <ul>
 * 				<li>	onTimeSelect: callback function invoked when user selects a time from the box
 * 				<li>	stTime: start Time -  Default is 0 hours
 * 				<li>	etTime: End Time - Default is 24 Hours
 * 				<li>	interval: The minutes interval - default is 4 (15 mins interval)
 * 			</ul>
 *
 * @Example
 * <code>
 * Web2Cal.TimeControl(document.getElementById("eventStartTIme"));
 * </code>
 * <code>
 * Web2Cal.TimeControl(document.getElementById("endStartTIme") ,  document.getElementById("eventStartTIme"));
 * </code>
 * <code>
 * Web2Cal.TimeControl(document.getElementById("endStartTIme") , document.getElementById("eventStartTIme"),
 *                      {
 *                        onTimeSelect: updateDateForTime
 *                      , timeFormat: 24
 *                      });
 * </code>
 */
Web2Cal.TimeControl = function  ( control, fromTime, opts)
{
    this.settingsTimeFormat = null;
    this.startOptionNumber = 0;
    this.timeformat=1;

    if(control==undefined)
    {
        return;
    }
    this.control=control;
    this.cont=jQuery("<div class='timecontrolContainer' id='timeControl"+control.id+"'></div>").appendTo("body");
//    this.underpop=this.underpop=jQuery('<iframe src="about:blank" id="timeControlUnderPop'+control.id+'"  name="ssTimeControlUnderPop'+control.id+'" class="ssTimeControlUnderPop"  marginheight="0" frameborder="0" vspace="0" hspace="0"  style="display:none;position:absolute; top:0; left:0;"></iframe>').appendTo("body");
    this.options=(opts) || new Object();
    this.options.stTime= (this.options.stTime==undefined)?0:this.options.stTime;
    this.options.etTime= (this.options.etTime==undefined)?24:this.options.etTime;
    this.options.interval= (this.options.interval==undefined)?4:this.options.interval;
    this.options.timeformat = (this.options.timeFormat==undefined)?12:(+this.options.timeFormat);
    if(fromTime){this.cont.addClass("_diffed");}

    this.Initialize(fromTime);
    var self=this, arr={cont: self.cont, obj:self, trigger:this, control:self.control} ;
    jQuery(document).bind("mousedown",{}, self.getHandleClick(  arr)	 );
}
Web2Cal.TimeControl.prototype = {

    getHandleClick:function(  arr)
    {
        var self=this;
        return function(ev){
            self.handleOutsideClick(ev,arr);
        }
    },
    handleOutsideClick:function(ev,data)
    {
        if(ev.target!=data.obj.control
            //&& ! jQuery(ev.target).isChildOf(data.cont.get(0) )
            && !WUtil.isChildOf(data.cont.get(0), ev.target, data.cont.get(0))
            ){
            data.cont.hide();
            //data.obj.underpop.hide();
        }
    },
    getTimeOptions: function (options)
    {
        var toptions=[];
        var eachblock=60/options.interval;
        for(var i=options.stTime;i<=options.etTime; i++)
        {
            var interval=0;
            var ampm=(this.options.timeformat== 12) ?((i>11 && i!=24)?"PM":"AM"): "";
            var mins=0;
            var tmp=(this.options.timeformat == 12)?(i>12)?i-12:i : i;

            var tmp=(tmp==0)?12:tmp;

            toptions.push({Value:tmp+":"+WUtil.padNumber(mins,2)+((this.options.timeformat==12)?" ":"")+ampm });
            while(interval<options.interval-1 && i!=24)
            {
                mins=mins+eachblock;
                interval++;
                toptions.push({Value:tmp+":"+WUtil.padNumber(mins,2)+((this.options.timeformat==12)?" ":"")+ampm });
            }
        }
        return toptions;
    },
    getGuid:function(time)
    {
        time= time.replace(" ", "");
        return time.replace(":", "");
    },
    Initialize: function(fromTime)
    {
        var fromTimeObj =  fromTime;
        this.fromTimeObj=fromTimeObj;
        var div1, timeOptions, pattern, startOptionValue;
        if (this.options.timeformat == 1) {
            pattern = /^1?[0-9](:[03]0)?(\s+(AM|PM))$/;
        } else {
            pattern = /^([0-2])?[0-9](:[03]0)$/;

        }
        this.patt=pattern;
        this.timeOptions=this.getTimeOptions(this.options);

        var len =  this.timeOptions.length;
        var self=this;
        this.startOptionNumber =0;
        for (var i=0; i<len; i++) {
            this.cont.append('<a class="timeTxt"><span class="datime '+this.getGuid(self.timeOptions[i].Value)+'" >'+ self.timeOptions[i].Value+'</span><em class="diffTime"></em></a>');
        }
        this.cont.find("a.timeTxt").click(function(){var t=jQuery("span.datime",this).html(); self.setTime(t);});

        this.control.onfocus=function(ev){
            self.Show(this,ev);

        }
        jQuery(document).bind('keydown', {cont: self.cont, obj:self}, self.keyDown);
    },
    getTime: function(data)
    {
        var self=this;
        return function () {
            self.setTime(data);
        }
    },
    setTime:function(data)
    {
        this.control.value=data;
        //Call back if user has passed a function for call back
        if(this.options.onTimeSelect)
            this.options.onTimeSelect(data, this.options, this._prevTime);

        this.Hide();
    },
    getMatchingIndex:function(time)
    {
        var index=0;
        for (var i=0; i< this.timeOptions.length; i++)
        {
            if(this.timeOptions[i].Value.toLowerCase() == time.toLowerCase()){
                index=i;
                break;
            }
        }
        return index;
    },
    Show: function (obj, event)
    {
        jQuery("div.timecontrolContainer").hide();
        //jQuery("iframe.ssTimeControlUnderPop").hide();
        //this.StopEvents(event);
        this.parentObj = obj;
        var as=WUtil.getBounds(this.control);
        this._prevTime=this.control.value;
        this.cont.show().css({left:as.Left+1, top:(as.Top+as.Height), zIndex:999999});

        var w=this.cont.width();
        //this.underpop.show().css({left:as.Left+1, top:(as.Top+as.Height), zIndex:400, width: w});

        //var self=this;
        if(this.fromTimeObj!=null)
        {
            var stIndex=this.getMatchingIndex(this.fromTimeObj.value);
            this.startOptionNumber=stIndex;
            // ssdebug(stIndex);
            var oneb=60/this.options.interval;
            this.cont.find("em.diffTime").html("");
            this.cont.find("a.timeTxt").show();
            if(stIndex>0)
            {
                var cnt=0;
                var l=this.timeOptions.length;
                var intval=this.options.interval;
                var tx=stIndex+1;
                this.cont.find("a.timeTxt:eq("+tx+")").prevAll().hide();
                for (i=stIndex; i<l; i++) {

                    hr=Math.floor( cnt/ intval);
                    mins=Math.floor(cnt%intval)*oneb;

                    cnt++;
                    this.cont.find("a.timeTxt:eq("+i+") .diffTime").html(" ("+hr+":"+mins+" hrs)");
                }
            }
        }
        this.cont.find("span.datime").parent().removeClass("currTime");

        if (obj.value != "")
        {
            this.cont.find("." + this.getGuid(obj.value) + "").parent().addClass("currTime");
            this.cont.get(0).scrollTop = this.ScrollValue(obj);
        }
    },
    keyDown: function(ev)
    {
        if(ev.keyCode==27)
        {
            //var self=this;
            ev.data.obj.Hide();
            var event = ev || window.event;
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }

    },
    Hide: function ()
    {
        //this.container.style.display="none";
        //this.underpop.hide();
        this.cont.hide();
    },
    ScrollValue : function(obj)
    {
        var timeOptions, v = 0; //vertical offset
        var ThisTime = jQuery.trim(obj.value);


        var len = this.timeOptions.length;
        for (var i=this.startOptionNumber; i<len; i++)
        {
            if (ThisTime.toLowerCase() == this.timeOptions[i].Value.toLowerCase())
            {
                return ((v - 1) * 19); //16-height of 1 option
            }
            v++;
        }
    }
    /*,
     StopEvents: function(event)	{
     var event = event || window.event;
     if (event.stopPropagation) {
     event.stopPropagation();
     } else {
     event.cancelBubble = true;
     }
     }*/
};
//Web2Cal.TimeControl=SSTimeControl;

