<?php
require 'Slim/Slim.php';
include 'common.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();
$app->get('/calendars', 'getCalendars');
$app->run();



function getCalendars(){
    try {
        $calendars = getCalendarsForUser(0, null);

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($calendars);
        } else {
            echo $_GET['callback'] . '(' . json_encode($calendars) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getCalendarsForUser( $userId, $parentId){
    $sql = "SELECT `id`, `name`, `parent_id`, `created_dt`, `created_by`, `description`, `user_id` FROM `calendar` WHERE 1=1 ";//parent_id is null";


    try {
        $db = getConnection();

        if( $parentId == null){
            $sql = $sql." and parent_id is null";
        } else {
            $sql = $sql." and parent_id = :parentId";
        }
        //echo $sql;
        $stmt = $db->prepare($sql);

        if( $parentId == null){
        } else {
            $stmt->bindParam("parentId", $parentId);
        }
        $stmt->execute();
        $calendarList = $stmt->fetchAll(PDO::FETCH_OBJ);
        //var_dump ($calendarList);
        $db = null;
        // get events for this calendar

        $allCalendars=array();
        foreach( $calendarList as $calendar ) {
            $formattedCalendar['groupId'] = $calendar->id;
            $formattedCalendar['name'] = $calendar->name;
            $formattedCalendar['description'] = $calendar->description;
            // get all events for this calendar
            $formattedCalendar['events']= getEventsForCalendar($calendar->id);
            //get calendars for which this is parentid
            $formattedCalendar['groups'] = getCalendarsForUser($userId, $calendar->id);
            $allCalendars[]=$formattedCalendar;
        }
        if( count( $allCalendars ) == 0)return null;

        return $allCalendars;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getEventsForCalendar($calendarId){
    $query = "SELECT `id`, `name`, `description`, `start_time`, `end_time`, `all_day`
         , `calendar_id`, `repeat_mode`, `event_type`, `rel_event_id`, `repeat_end_date`, `event_delete_ind`
         , `recur_sequence`, `repeat_count`, `day_only_weekdays`, `week_days`, `month_weeknumber`, `month_weekday`
         , `month_repeatdate`, `year_repeatdate`, `user_id`, `created_dt`, `created_by`, `assigned_to`
          FROM `events` WHERE calendar_id=:id";

    try {
        $db = getConnection();
        $stmt = $db->prepare($query);
        $stmt->bindParam("id", $calendarId);
        $stmt->execute();
        $events = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        $allEvents = array();
        foreach( $events as $ev ) {
            $event = createEventObjectFromTableRow($ev);
            $allEvents[] = $event;
        }

        return $allEvents;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


