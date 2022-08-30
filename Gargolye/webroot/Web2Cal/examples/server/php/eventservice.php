<?php
require 'Slim/Slim.php';
require 'common.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/event/:id', 'getEvent');
$app->post('/event/saveEvent',  function () use ($app) {
    saveEvent($app);
});
$app->put('/event/saveEvent',  function () use ($app) {
    saveEvent($app);
});
$app->put('/event/updateEvent',  function () use ($app) {
    updateEvent($app);
});

$app->run();


function updateEvent($app){

    $request = $app->request();
    $body = $request->getBody();
    $ev = json_decode($body);

    $sql = "UPDATE `events` SET  `name`=:name
            ,`description`=:description,
            `start_time`=:start_time,`end_time`=:end_time,`all_day`=:all_day,`calendar_id`=:calendar_id,`repeat_mode`=:repeat_mode,`event_type`=:event_type,`rel_event_id`=:rel_event_id,`repeat_end_date`=:repeat_end_date,`event_delete_ind`=:event_delete_ind,`recur_sequence`=:recur_sequence,`repeat_count`=:repeat_count
            ,`day_only_weekdays`=:day_only_weekdays,`week_days`=:week_days,`month_weeknumber`=:month_weeknumber,`month_weekday`=:month_weekday,`month_repeatdate`=:month_repeatdate,`year_repeatdate`=:year_repeatdate,`user_id`=:user_id WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("name", $ev->eventName);
        $stmt->bindParam("description", $ev->description);
        $stmt->bindParam("start_time", $ev->startTime);
        $stmt->bindParam("end_time", $ev->endTime);
        $stmt->bindParam("all_day", $ev->allDayEvent);
        $stmt->bindParam("calendar_id", $ev->groupId);
        $stmt->bindParam("repeat_mode", $ev->repeatMode);
        $stmt->bindParam("event_type", $ev->eventType);
        $stmt->bindParam("rel_event_id", $ev->relEventId);
        $stmt->bindParam("repeat_end_date", $ev->repeatEndDate);
        $stmt->bindParam("event_delete_ind", $ev->deleted);
        $stmt->bindParam("recur_sequence", $ev->sequence);
        $stmt->bindParam("repeat_count", $ev->repeatCount);
        $stmt->bindParam("day_only_weekdays", $ev->dayOnlyWeekdays);
        $stmt->bindParam("week_days", $ev->weekDays);
        $stmt->bindParam("month_weeknumber", $ev->monthWeekNumber);
        $stmt->bindParam("month_weekday", $ev->monthWeekDay);
        $stmt->bindParam("month_repeatdate", $ev->monthRepeatDate);
        $stmt->bindParam("year_repeatdate", $ev->yearRepeatDate);
        $stmt->bindParam("year_repeatdate", $ev->yearRepeatDate);
        $stmt->bindParam("user_id", $ev->userId);
        //$stmt->bindParam("created_dt", date('Y-m-d H:i:s'));
        $stmt->bindParam("id", $ev->eventId);
        $stmt->execute();
        // $ev->id = $db->lastInsertId();
        $db = null;

        getEvent($ev->eventId);
        // echo json_encode($ev);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

    //$ev = json_decode($request->getBody());
    // echo json_encode($ev);

}


function saveEvent($app){

    $request = $app->request();
    $body = $request->getBody();
    $ev = json_decode($body);

    $sql = "INSERT INTO
    `events`( `name`, `description`, `start_time`, `end_time`, `all_day`, `calendar_id`, `repeat_mode`,
    `event_type`, `rel_event_id`, `repeat_end_date`, `event_delete_ind`, `recur_sequence`, `repeat_count`,
    `day_only_weekdays`, `week_days`, `month_weeknumber`, `month_weekday`, `month_repeatdate`, `year_repeatdate`,
    `user_id`, `created_dt`, `created_by`, `assigned_to`)
    VALUES ( :name, :description, :start_time, :end_time, :all_day, :calendar_id, :repeat_mode
    ,:event_type, :rel_event_id, :repeat_end_date, :event_delete_ind, :recur_sequence, :repeat_count
    ,:day_only_weekdays, :week_days, :month_weeknumber, :month_weekday, :month_repeatdate, :year_repeatdate
    ,:user_id , utc_timestamp(), :created_by, :assigned_to)";

    $repeatObj = $ev->repeatObject;
    if( $repeatObj !=null ) {
        $rMode = $repeatObj->mode;

        if(property_exists($repeatObj, 'day') && property_exists($repeatObj->day, 'onlyWeekDays'))
            $onlyWeekDays = $repeatObj->day->onlyWeekDays;

        if(property_exists($repeatObj, 'week') ){
            $weekRepeatDays =$repeatObj->week->days;
        }
        if(property_exists($repeatObj, 'month') ){
            $mRepeatDate =$repeatObj->month->repeatDate;
            $mWeekNumber =$repeatObj->month->weekNumber;
            $mWeekDay =$repeatObj->month->weekDay;
        }
        if(property_exists($repeatObj, 'year') ){
            $yRepeatDate = $repeatObj->year->repeatDate;
        }
    }
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("name", $ev->eventName);
        $stmt->bindParam("description", $ev->description);
        $stmt->bindParam("start_time", $ev->startTime);
        $stmt->bindParam("end_time", $ev->endTime);
        $stmt->bindParam("all_day", $ev->allDayEvent);
        $stmt->bindParam("calendar_id", $ev->groupId);
        $stmt->bindParam("event_type", $ev->eventType);
        $stmt->bindParam("rel_event_id", $ev->relEventId);
        $stmt->bindParam("repeat_end_date", $ev->repeatEndDate);
        $stmt->bindParam("event_delete_ind", $ev->deleted);
        $stmt->bindParam("recur_sequence", $ev->sequence);
        $stmt->bindParam("repeat_count", $ev->repeatCount);

        $stmt->bindParam("repeat_mode", $rMode );
        $stmt->bindParam("day_only_weekdays", $onlyWeekDays );
        $stmt->bindParam("week_days", $weekRepeatDays);
        $stmt->bindParam("month_weeknumber", $mWeekNumber);
        $stmt->bindParam("month_weekday", $mWeekDay);
        $stmt->bindParam("month_repeatdate", $mRepeatDate);
        $stmt->bindParam("year_repeatdate", $yRepeatDate);

        $stmt->bindParam("user_id", $ev->userId);
        //$stmt->bindParam("created_dt", date('Y-m-d H:i:s'));
        $stmt->bindParam("created_by", $ev->createdBy);
        $stmt->bindParam("assigned_to", $ev->createdBy);
        $stmt->execute();
        $ev->id = $db->lastInsertId();
        $db = null;

        getEvent($ev->id);
        // echo json_encode($ev);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

    //$ev = json_decode($request->getBody());
    // echo json_encode($ev);

}

function getEvent($id){
    $query = "SELECT `id`, `name`, `description`, `start_time`, `end_time`, `all_day`
         , `calendar_id`, `repeat_mode`, `event_type`, `rel_event_id`, `repeat_end_date`, `event_delete_ind`
         , `recur_sequence`, `repeat_count`, `day_only_weekdays`, `week_days`, `month_weeknumber`, `month_weekday`
         , `month_repeatdate`, `year_repeatdate`, `user_id`, `created_dt`, `created_by`, `assigned_to`
          FROM `events` WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($query);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $event = $stmt->fetchObject();
        $db = null;

        $event = createEventObjectFromTableRow($event);
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($event);
        } else {
            echo $_GET['callback'] . '(' . json_encode($event) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}