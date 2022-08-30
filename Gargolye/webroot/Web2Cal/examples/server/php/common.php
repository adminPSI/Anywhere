<?php

function getConnection() {
$dbhost="127.0.0.1";
$dbuser="root";
$dbpass="password";
$dbname="web2cal";
$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
return $dbh;
}


function createEventObjectFromTableRow($arr){
    $event='';
    $event["eventId"]=$arr->id;

    $event['eventName']=$arr->name;
    $event['name']=$arr->name;
    $event['eventDesc']=$arr->description;
    $event['startTime']=$arr->start_time;
    $event['endTime']=$arr->end_time;
    $event['group']['groupId']=$arr->calendar_id;
    $event['groupId']=$arr->calendar_id;
    $event['eventType']=$arr->event_type;

    $repeatEvent='';

    $repeatEvent['mode']=$arr->repeat_mode;
    $repeatEvent['repeatCount']=$arr->repeat_count;
    if($arr->repeat_end_date=="0000-00-00 00:00:00")
        $repeatEvent['endDate']="2999-12-31 00:00:00";
    else
        $repeatEvent['endDate']=$arr->repeat_end_date;

    //day repeat
    $dayOptionOnlyWeekDays=$arr->day_only_weekdays;
    $repeatEvent['day']['onlyWeekDays']=($dayOptionOnlyWeekDays==1)?true:null;

    //week repeat info
    $weekDaysStr=$arr->week_days;
    $repeatEvent['week']['days']= preg_split('/,/', $weekDaysStr);

    //month
    $repeatEvent['month']['weekNumber']=$arr->month_weeknumber;
    $repeatEvent['month']['weekDay']=$arr->month_weekday;

    if($arr->month_repeatdate=="0000-00-00 00:00:00" || ( $arr->month_weeknumber !="" ))
        $repeatEvent['month']['repeatDate']=null;
    else {
        $repeatEvent['month']['repeatDate']=$arr->month_repeatdate;
        $repeatEvent['month']['weekNumber']=null;
        $repeatEvent['month']['weekDay'] = null;
    }
    $repeatEvent['year']['date'] = $arr->year_repeatdate;

    $event['repeatEvent']=$repeatEvent;
    $event['relEventId']=$arr->rel_event_id;
    $event['allDay']=($arr->all_day==0)?false:true;
    $event['sequence']= $arr->recur_sequence;
    $event['deleted']=($arr->event_delete_ind==null || $arr->event_delete_ind==0 )?false:true;

    if( $repeatEvent['mode'] == "" )
        $event['repeatEvent']= null;

    $event['createdBy']= $arr->created_by;
    $event['createdDate']= $arr->created_dt;
    return $event;
}
