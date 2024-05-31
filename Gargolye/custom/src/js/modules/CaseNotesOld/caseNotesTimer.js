var caseNotesTimer = (function() {
  function clearTimerOnSave() {
    clearInterval($.caseNotes.interval);
    clearTimeout($.caseNotes.inactTime);
    clearInterval(inactivityTime);
    clearTimeout(inactivityTime);
    //$.caseNotes.inactTime = 0;
    $.caseNotes.documentTimeSeconds = 0;
    window.onload = null;
    document.onmousemove = null;
    document.onkeypress = null;
  }
  function pauseTimer(fromInactive) {
    clearInterval($.caseNotes.interval);
    clearTimeout($.caseNotes.inactTime);
    clearTimeout($.caseNotes.inactiveTimeForClear);
    clearInterval(inactivityTime);
    clearTimeout(inactivityTime);
    $.caseNotes.inactTime = 0;
    window.onload = null;
    document.onmousemove = null;
    document.onkeypress = null;
    $('#cnTimerStart').css('background', '#eee');
    $('#minutes').attr('contenteditable', 'true');
    $('#minutes').removeClass('unclickableElement');
    $('#editcasenotetimer').removeClass('unclickableElement');
    if (fromInactive) {
    } else {
      displayDocTime(); //
    }
  }
  function resetTimer() {
    if ($.caseNotes.dontResetInactTimerFlag == false) {
      clearTimeout($.caseNotes.inactTime);
      clearInterval($.caseNotes.inactTime);
      clearInterval($.caseNotes.inactiveTimeForClear);
      clearTimeout($.caseNotes.inactiveTimeForClear);
      clearTimeout(inactivityTime);
      $.caseNotes.inactTime = setTimeout(logout, 120000);
    }
  }
  function logout() {
    //alert("Your documentation time has been paused.");
    clearInterval(inactivityTime);
    clearInterval($.caseNotes.inactTime);
    clearInterval($.caseNotes.inactiveTimeForClear);
    clearTimeout(inactivityTime);
    var answer = confirm('Your documentation time has been paused. Continue timing');
    if (answer) {
      resetTimer();
    } else {
      pauseTimer(true);
    }
  }
  var inactivityTime = function() {
    $.caseNotes.inactTime = setTimeout(logout, 120000);
    $.caseNotes.inactiveTimeForClear = $.caseNotes.inactTime;
    var t;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
  };
  function startCaseNoteTimer(state, timeInSeconds) {
    $('#minutes').attr('contenteditable', 'false');
    $('#editcasenotetimer').addClass('unclickableElement');
    $('#minutes').addClass('unclickableElement');
    inactivityTime();
    var minutesLabel = document.getElementById('minutes');
    var totalSeconds = 0;
    totalSeconds = $.caseNotes.documentTimeSeconds;
    $.caseNotes.interval = setInterval(setTime, 1000);
    $('#cnTimerStart').css('background', 'green');
    function setTime() {
      ++totalSeconds;
      $.caseNotes.documentTimeSeconds = totalSeconds;
    }
  }


  return {
    clearTimerOnSave,
    startCaseNoteTimer
  }


})();