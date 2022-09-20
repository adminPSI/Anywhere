var documentationTimer = (function() {
  var runningTime = 0;
  var saveTime;
  var inactTime;
  var timer;
  var minutes;
  var startBtn;
  let timerRunning = false;

  function clearTimer() {
    clearTimeout(inactTime);
    clearInterval(timer);
    window.onload = null;
    document.onmousemove = null;
    document.onkeypress = null;
    runningTime = 0;
    minutes = 0;
    inactTime = null;
    timer = null;
  }

  var inactivityTime = function() {
    inactTime = setTimeout(inactiveAlert, 120000);
  };

  function inactiveAlert() {
    //Speech to text, check if speech to text is listening, and reset inactivity if it is
    if (document.querySelector('.stt_listening')) {
      resetInactivityTimer();
      return
    }
    clearTimeout(inactTime);
    clearInterval(timer);
    var answer = confirm(
      "Your documentation time has been paused. Continue timing?"
    );
    if (answer) {
      resetInactivityTimer();
      const start = Date.now() - (runningTime * 1000);
      timer = setInterval(function() {
        const deltaMS = Date.now() - start; // milliseconds elapsed since start
        const deltaS = Math.floor(deltaMS / 1000);
        runningTime = deltaS;
        // console.log(runningTime)
        const newMinutes = Math.round(Math.floor(runningTime/30) / 2)
        if (newMinutes !== minutes) {
          minutes = newMinutes;
          const minArea = document.getElementById("docTimeMinutesDisplay");
          minArea.value = minutes;
        }
    }, 1000);
    } else {
      // pauseTimer
      note.getTimeFromInactivity(stopTimer())
    }
  }

  function resetInactivityTimer() {
    clearTimeout(inactTime);
    inactTime = setTimeout(inactiveAlert, 120000);
  }

  function startPercisionTimer(prevTime) {
    if (timerRunning) {
      clearTimer();
    } else {
      docTimerMutationObserver()
    }
    let start
    timerRunning = true;
    startBtn = document.getElementById("cnTimerStart");
    startBtn.dataset.toggled = "true";
    if (prevTime) {
      const prevTimeMS = parseInt(prevTime) * 1000; // convert to ms
      start = Date.now() - prevTimeMS;
    } else {
      start = Date.now();
    }
    inactivityTime();
    timer = setInterval(function() {
        const deltaMS = Date.now() - start; // milliseconds elapsed since startm
        const deltaS = Math.floor(deltaMS / 1000);
        runningTime = deltaS;
        // console.log(runningTime)
        const newMinutes = Math.round(Math.floor(runningTime/30) / 2)
        if (newMinutes !== minutes) {
          minutes = newMinutes;
          const minArea = document.getElementById("docTimeMinutesDisplay");
          minArea.value = minutes;
        }
    }, 1000);
    window.onload = resetInactivityTimer;
    document.onmousemove = resetInactivityTimer;
    document.onkeypress = resetInactivityTimer;
  }

  // function startTimer(prevTime) {
  //   if (timerRunning) {
  //     clearTimer();
  //   } else {
  //     docTimerMutationObserver()
  //   }
  //   timerRunning = true;
  //   startBtn = document.getElementById("cnTimerStart");
  //   startBtn.dataset.toggled = "true";
  //   if (prevTime) runningTime = parseInt(prevTime);
  //   inactivityTime();
  //   timer = setInterval(setTime, 1000);
  //   window.onload = resetInactivityTimer;
  //   document.onmousemove = resetInactivityTimer;
  //   document.onkeypress = resetInactivityTimer;
  // }

  // function setTime() {
  //   ++runningTime;
  //   var newMinutes = Math.round(Math.floor(runningTime/30) / 2)
  //   if (newMinutes !== minutes) {
  //     minutes = newMinutes;
  //     var minArea = document.getElementById("docTimeMinutesDisplay");
  //     minArea.value = minutes;
  //   }
  // }

  function stopTimer() {
    if (docTimerMutationObserver.disconnect) docTimerMutationObserver.disconnect();
    timerRunning = false;
    startBtn = document.getElementById("cnTimerStart");
    startBtn.dataset.toggled = "false";
    saveTime = runningTime;
    clearTimer();
    return saveTime;
  }

  function docTimerMutationObserver() {
    const observNode = document.getElementById("actioncenter");
    const config = { attributes: true };
    const callback = function(mutationList, observer) {
      for (let mutation of mutationList) {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === "data-active-section") {
            observer.disconnect();
            clearTimer();
            timerRunning = false;
          }
        }
      }
    }
    const observer = new MutationObserver(callback);
    
    function disconnect() {
      observer.disconnect();
    }
    
    observer.observe(observNode, config)
    docTimerMutationObserver.disconnect = disconnect;
  }

  return {
    startTimer: startPercisionTimer,
    stopTimer
  };
})();
