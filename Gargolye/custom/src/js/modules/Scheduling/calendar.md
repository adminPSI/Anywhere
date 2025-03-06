1. [x] Show the Location and Employee dropdowns at the top. If the logged in user does not have the Scheduler security key for Anywhere Scheduling, set the Employee dropdown as the logged in user and disable it. Else, default to logged in user and allow user to select different employee. See mockup #1.
    * [x] Include an option for ALL in both the Location and Employee dropdowns.
    * [x] If the Employee dropdown is disabled, only show shifts on the 'calendar' where the employee is the same as the logged in user.
    * [x] If the logged in user does not have the Scheduler security key for Anywhere Scheduling, the values in the Location dropdown should only show locations where the logged in user is assigned to a shift. If the Show Open Shift radio button is "Yes", it should also include any location that has an open shift (a shift where there is no employee assigned). If the user does have the Scheduler security key, show all active locations.
    * [x] If the value of ALL is selected in the Location dropdown, group shifts by assigned location. Show the location name to the left of each group. See mockup #2. If ALL is not selected, do not show location name to the left (see mockup #1).
    * [x] Include a (NONE) (with the parantheses) option for the Employee dropdown only if the user selects to view open shifts (via the radio button at the top of the page). This should be the top option in the dropdown. If selected, display shifts with no assigned employee. If the user selects "No" to the open shifts radio button while None is selected in the Employee dropdown, hide the None option in the dropdown and change the employee to be the logged in user.
    * [x] Location dropdown should show same values that are shown in the current Location dropdown
    * [x] Employee dropdown should show all active employees from the same Vendor as the logged in user (in addition to the (NONE) option in requirement #1e above).

2. [x] Add + ADD NEW SHIFT button (see mockup #1). When clicked, show the Add New Shift popup form (see mockup #2).  NOTE: Most of this refers to the location_schedules table.
    * [x] Only display the + ADD NEW SHIFT button if the logged in user has the Scheduler security key for Anywhere Scheduling.
    * [x] Location dropdown should show same values shown in the Location dropdown on the previous screen.  Required field.
    * [x] Employee dropdown should show employees based on the criteria behind the FILTER EMPLOYEE LIST button.  This dropdown should be disabled until a location is selected.  This field is not required.  The dropdown should automatically not include any employee that is already assigned to a shift that overlaps with the selected shift.  Include a (NONE) option as the first option in the list.  If this (NONE) option is selected when user saves, set the location_schedules.person_id to null.
    * [x] Validate that start time comes before end time.  Required field.
    * [x] Selecting a value in the Color dropdown is optional.  Colors should include Red, Orange, Yellow, Blue, Green, and Purple.  If a color is selected, the background color of the shift on the calendar should be the selected color. If no color is selected, show with white background.  This color option can be stored in the new location_schedules.color column.
    * [ ] **Display consumers tied to the shift (via schedule_consumer table).  If a consumer is clicked on, remove that consumer from the shift.**
    * [x] Include + ADD INDIVIDUAL button below list of consumers.  When clicked, it should go to a roster of consumers tied to the location selected in the Location dropdown.  Allow users to select multiple consumers.  This should work similarly to how consumers are added to time records in the Time Entry module.
    * [x] Show FILTER EMPLOYEE LIST button.  When clicked, take user to mockup #3.  These options determine which employees should show in the employee dropdown (see mockup #3).  User should be able to enter the number of hours and minutes that is shown in the filter pop-up form.
        [x] On open of pop-up, automatically check the "Only include employees trained at this location" and the "Exclude employees who have a day off that overlaps with this shift".  When a shift is opened for editing or a new shift is being created, the employee dropdown should automatically filter by these options.
        [x] Use the locations_trained table to determine if an employee is trained at a location.  Use the employee_days_off table to determine if an employee has a day off.
        [x] Use day_of_the_week table to determine the given vendor's work week.
        [ ] **When user clicks UPDATE EMPLOYEE LIST, if there was an employee already selected in the dropdown before getting to this pop-up and the selected employee no longer fits the criteria selected here, clear the Employee dropdown when going back to the Add Shift/Edit Shift popup.**
    * [o] Show Notify Employee checkbox.  **Automatically set to checked if any date selected on shift is on or after today AND the shift is published.  If all dates selected on shift is null or before today OR the shift is not published, make the box unchecked and disable the checkbox.  Validate this whenever the date is changed on the form.  If checked on Save, send notification to employee via insights for each shift saved.  Message should say:  You have been scheduled to work a new shift!  Date: (shift date)  Location:  (shift location)  Start Time:  (shift start time)  End Time:  (shift end time).**
    * [MIKE] **On save, validate that the employee on the shift doesn't have an existing shift that overlaps with this new shift and also validate that the consumers tied to the shift are assigned to the location selected on the shift (via consumer_service_locations).  Also, validate that the selected employee fits the criteria behind the FILTER EMPLOYEE LIST button.**
    * [x] Whenever the value in the Location dropdown is changed, remove selected consumers and employee from the shift.
    * [ ] At the top of the pop-up display one checkbox per day of the week.  The specific dates (e.g. 7/6, 7/7, etc.) should be the same as the days of the week that were on the previous screen when the + ADD SHIFT button was selected and it was in the WEEK view.  If it was in the DAY view, show the week that includes the day that was shown.  If it was MONTH view, show the week that includes today's date.  It should always show Sunday thru Saturday.  Allow user to advance/go back one week at a time by clicking the back/forward arrows.  Allow user to select multiple days. On save, save a shift for each day selected.

3. [x] Add PUBLISH/UN-PUBLISH SCHEDULES button beside the MONTH/WEEK/DAY view selections (see mockup #1).  Only show this  button if the logged in user has the Scheduler security key for Anywhere Scheduling.
    * [x] When clicked, display a pop up that allows the user to select a location, employee, and date range.  Values are required for all fields.  Include options for ALL in the Location and Employee dropdowns.
    * [x] When the user clicks PUBLISH button, set the publish_date column in location_schedules to the date/time the user published the schedules for all shifts that fit the criteria in these fields supplied by the user.  Close the pop-up.
        [x] Also, if Notify Employees checkbox is checked, send a notification via insights to each employee who had a shift get published.  The message should say something like "Your schedule for (begin date) - (end date) can now be viewed in Advisor Anywhere!  Login to check it out." (or something like that)
    * [x] When the user clicks UN-PUBLISH, set the publish_date column in location_schedules to null for all shifts that fit the criteria in these fields supplied by the user.  Close the pop-up.
        [x] Also, if Notify Employees checkbox is checked, send a notification via insights to each employee who had a shift get published. The message should say something like "Your schedule for (begin date) - (end date) has been un-published in Advisor Anywhere! Login to view your current schedule." (or something like that)

4. [x] When displaying shifts on the calendar, stack them.
    * [x] On the shifts, display the start time, end time, and employee assigned to work the shift.  If there is no employee on the shift, show "(OPEN)".  See mockup #1.
    * [x] In the lower left hand corner of each shift, show an icon that indicates if that shift has been published or not (see requirement #3 above).  If location_schedules.published_date is null, show a closed eye (or something similar to the mockup).  If location_schedules.published_date is not null, show an open eye (or something similar to the mockup).

5. [x] When the user clicks on a shift, display a pop-up that shows the details of that shift.
    * [o] If the logged in user has the Scheduler security key for Anywhere Scheduling, this pop-up should look just like the form used to add a new shift with the same functionality (see requirement #2) with the following exceptions:
        [o] The Notify Employee checkbox should be unchecked and disabled when the form is opened.  If the user makes any change to the values displayed on the form AND the date on the form is after today, then the checkbox should automatically get checked and enabled.  If the user makes no change to the form OR the date on the form is null or before today, the box should be unchecked and disabled.  On SAVE, if this box is checked, then an insights notification should be sent to the user that says something like "Your schedule has been updated! " and show details of the new shift.  If a shift was changed by changing an employee, then an additional insights message should go out to the FORMER employee that says "You have been removed from the following shift:" along with shift details. 
        [o] Use existing logic to determine if the CALL OFF or REQUEST SHIFT buttons should display at the bottom
    * [o] If the logged in user does NOT have the Scheduler security key for Anywhere Scheduling, it should look like the form used to add a new shift with the following exceptions:
        [x] All fields should be disabled
        [x] The FILTER EMPLOYEE LIST button should be hidden
        [x] The Color dropdown should be hidden
        [x] The + ADD INDIVIDUAL button should be hidden and consumers should not be able to be removed by clicking on them
        [x] The Notify Employee checkbox and label should be hidden
        [o] Use existing logic to determine if the CALL OFF or REQUEST SHIFT buttons should display at the bottom

6. [x] On each shift in the calendar view, add a copy icon in the lower right hand corner.
    * [ ] The "title" of the pop-up should be say "Copy Shift"
    * [ ] On save, do not update the existing shift (the shift that the copy button was clicked from), but create a new shift with the details provided by the user.  Still perform same validation that is done when adding a new shift (see requirement #2 above)
    * [ ] See requirement #2 above to determine which fields should be visible/hidden logic for sending any insights notifications, validation, etc.

7. [x] Update the logic that is currently being used to determine if a shift shows in Anywhere.
    [x] Right now, it's looking at schedule_periods.show_in_anywhere to determine if the shift should display.  Instead, now reference location_schedules.publish_date.  If publish_date is not null, then display the shift in Anywhere.  If publish_date is null, only show the shift if the user has the Scheduler security key.

8. [x] To the right of the Employee dropdown in mockups #1 and #2 above, add a dropdown called "Show".
    * [x] Values for this dropdown should be All Shifts, Published Shifts Only, and Un-Publishsed Shifts Only.
    * [x] Default to All Shifts.
    * [ ] **When updated, update calendar to only show shifts based on this selection. Use location_schedules.publish_date to determine if a shift is published or not.**
    * [x] This dropdown should only be visible if the user has the Scheduler security key for the Anywhere Scheduling window.
    * [x] Below this dropdown, show a count of Un-Published Shifts displayed on the page. IF the count is 0, show green ELSE show red. This should only show if the user has the Scheduler security key.


