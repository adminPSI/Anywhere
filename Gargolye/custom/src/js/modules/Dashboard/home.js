var displayTimeSelect = 'Y';
var validateError = '';
var numberOfCards = 4;

function pad(x) {
	return x < 10 ? '0' + x : x;
}

function ticktock() {
	var d = new Date();
	var h = pad(d.getHours());
	var m = pad(d.getMinutes());
	var s = pad(d.getSeconds());
	var current_time = [h, m].join(':');
}

function anywhere() {
	window.location = 'anywhere.html';
}

function popCalendar(event) {
	if ($('#calendardropdown').css('opacity') == '0') {
		$('#calendardropdown')
			.css('opacity', '1')
			.css('display', 'block');
	} else {
		$('#calendardropdown')
			.css('opacity', '0')
			.css('display', 'none');
	}
}

function startMessage() {
	if ($('#messageinput').val() == 'Add a new message...') {
		$('#messageinput').val('');
	}
}

function swapMessageBoxes() {
	if ($('#messageboxsmall').css('opacity') == '0') {
		$('#messageboxsmall')
			.css('opacity', '1')
			.css('display', 'block');
		$('#messageinput')
			.css('opacity', '0')
			.css('display', 'none');
		$('#messagetypebox')
			.css('opacity', '0')
			.css('display', 'none');
		$('#closemessageinput')
			.css('opacity', '0')
			.css('display', 'none');
	} else {
		$('#messageboxsmall')
			.css('opacity', '0')
			.css('display', 'none');
		$('#messageinput')
			.css('opacity', '1')
			.css('display', 'block');
		$('#messagetypebox')
			.css('opacity', '1')
			.css('display', 'block');
		$('#closemessageinput')
			.css('opacity', '1')
			.css('display', 'block');
	}
}

function showDownArrow() {
	if ($('clockrow').length == 0) {
		$('#downarrow')
			.css('opacity', '0')
			.css('display', 'none');
	} else {
		$('#downarrow')
			.css('opacity', '1')
			.css('display', 'block');
	}
}

function validateTime(startTime, stopTime) {
	var validTime = 1;
	if (startTime > stopTime && stopTime != '00:00:00') {
		validTime = 0;
	}
	return validTime;
}
///////////////////  Pop the display boxes ///////////////////////////////////
// Get time in and time out values for day service consumer rows:
function popDayStaffTimeBox(tagname, event) {
	var obj = $('#' + tagname);
	obj.blur();
	$('.timein').blur();
	$('.timeout').blur();
	if ($.session.DenyStaffClockUpdate == true) {
		return;
	}
	var now = new Date();
	var nonFormattedTime = '';
	originalText = $('#' + tagname).val();
	nonFormattedTime = originalText;
	if (tagname.indexOf('out') != -1) {
		if (originalText != '') {
			originalText = convertTimeToMilitary(originalText);
			$.session.initialTimeOut = originalText;
			$.session.initialTimeIn = '';
		}
	}
	if (tagname.indexOf('in') != -1) {
		originalText = convertTimeToMilitary(originalText);
		$.session.initialTimeIn = originalText;
		$.session.initialTimeOut = '';
	}
	setupTimeInputBox(obj, event);
	return false;
}

function validateStaffTime(tagname, valueText) {
	if (valueText.length > 8) {
		return false;
	}
	var rowid = '';
	var timein = '';
	var timeout = '';

	if (tagname.indexOf('out') > -1) {
		rowid = tagname.substring(7);
		timein = $('#timein' + rowid)
			.val()
			.replace(' ', '');
		timein = convertTimeToMilitary(timein);
		timeout = $('#' + tagname)
			.val()
			.replace(' ', '');
		timeout = convertTimeToMilitary(timeout);
	}

	if (tagname.indexOf('in') > -1) {
		rowid = tagname.substring(6);
		timeout = $('#timeout' + rowid)
			.val()
			.replace(' ', '');
		timeout = convertTimeToMilitary(timeout);
		timein = $('#' + tagname)
			.val()
			.replace(' ', '');
		timein = convertTimeToMilitary(timein);
	}
	timein = timein.replace(':', '');
	timeout = timeout.replace(':', '');
	if (timeout.length < 2) return true;
	if (timeout < timein && timeout != '00:00:00' && timeout != '0000:00' && timeout != '00:00') {
		validateError = 'In time can not be greater than out time.';
		window.timeOverlapError = false; //ensures error message above takes priority over time overlap error
		return false;
	}
	return true;
}

function getTimeClockInput(objId, rowId) {
	var obj = $('#' + objId),
		text = obj.text();
	obj.text('');
	var pushStr = "<select id='tempLocation' class='staffLocations' >";
	//make selected item the one on top
	for (var i in $.session.locations) {
		if ($.session.StaffLocId == $.session.locationids[i]) {
			pushStr = pushStr + '<option value=' + $.session.locationids[i] + '>' + $.session.locations[i] + '</option>';
		}
	}
	//and now the others
	for (var i in $.session.locations) {
		if ($.session.StaffLocId != $.session.locationids[i]) {
			pushStr = pushStr + '<option value=' + $.session.locationids[i] + '>' + $.session.locations[i] + '</option>';
		}
	}
	pushStr = pushStr + '</select>';
	$(pushStr)
		.appendTo(obj)
		.val(text)
		.focus()
		.change(function() {
			var newText = $('#tempLocation option:selected').text();
			var newValue = $('#tempLocation option:selected').val();
			obj.text(newText).attr('locid', newValue);
		});
}

function textFieldEdit(objId) {
	var text = $('#' + objId).text();
	$('#' + objId).text('');
	$('<input type="text" value="' + text + '" id="temptxt" class="daytextedit" maxlength="8"/>')
		.appendTo($('#' + objId))
		.val(text)
		.select()
		.blur(function() {
			var newText = $('#temptxt').attr('value');
			$('#' + objId).text(newText); //, find('input:text').remove();
		});
}

function showRemainingGoals(res, $goalsCount, $listTarget, $goalsConsumerCount) {
	var people = {},
		count = 0,
		consumerCount = 0;
	$('result', res).each(function() {
		count++;
		var ID = $('ID', this).text(),
			oid = $('oid', this).text(),
			first_name = $('first_name', this).text(),
			last_name = $('last_name', this).text(),
			fullName = [first_name, last_name].join(' ');
		if (!people[fullName]) people[fullName] = 0;
		people[fullName]++;
	});
	$goalsCount.text(count);
	var names = Object.keys(people);
	//names.sort();
	names.forEach(function(name) {
		consumerCount++;
		var li = $('<li>').text(name + ' - ' + people[name]);
		$listTarget.append(li);
	});
	$goalsConsumerCount.text(consumerCount);
}

function displayChangeUser() {
	var overlay = $('<div>')
		.addClass('modaloverlay')
		.css({
			backgroundColor: 'rgba(0, 0, 0, 0.15)',
		})
		.appendTo($('body'));

	$.ajax({
		type: 'GET',
		url: 'dist/templates/autologin.html?RNG=' + +new Date(),
		success: function(HTMLresponse, status, xhr) {
			//buildAbsentCard({ card: $("<div>").replaceWith(HTMLresponse), overlay: overlay, values: values, multi: true });
			var card = $(HTMLresponse);
			rosterAjax.getPSIUserOptionList(function(err, data) {
				overlay
					.click(function() {
						$(this).remove();
					})
					.append(card);

				card
					.click(function(e) {
						e.stopPropagation();
					})
					.bind('remove', function() {
						overlay.remove();
					});
				data.forEach(function(user) {
          var li = $('<li>').text([user.last_name, user.first_name +' ('+user.user_id+')'].join(', '));
					li.click(function() {
						$.session.UserId = user.user_id;
						//homeServiceLoad(false);
						changeFromPSIAjax(user.user_id);
						card.trigger('remove');
					});
					$('#autologinlist').append(li);
				});

			});
			psiLogin.buildPopup(overlay[0]);
		},
		error: function(xhr, status, error) {
			//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
		},
	});
	return;
}

function isNumberKey(evt) {
	var charCode = evt.which ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

	return true;
}

function formatDateGFromDB(date) {
	date = new Date(date);
	date = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
	return date;
}

function formatTimeFromDB(time) {
	var test = time.substr(0, 2);
	if (time.substr(0, 2) > 12 && time.substr(0, 2) < 22) {
		test2 = time.substr(0, 2) - 12;
		//tmpStartTime = tmpStartTime.replace(test, '0' + test2)
		time = time.replace(time.substring(0, 2), '0' + test2);
	} else if (time.substr(0, 2) >= 22) {
		test2 = time.substr(0, 2) - 12;
		time = time.replace(time.substring(0, 2), test2);
		//tmpStartTime = tmpStartTime.replace(test, test2)
	} else if (time.substr(0, 2) == 0) {
		time = time.replace(time.substring(0, 2), 12);
		//tmpStartTime = tmpStartTime.replace(test, test2)
	}
	//
	time = time.slice(0, 5);
	//
	if (test >= 12) {
		time = time + ' PM';
	} else {
		time = time + ' AM';
	}
	return time;
}

function convertTimeFromMilitary(value) {
	if (value !== null && value !== undefined) {
		//If value is passed in
		if (value.indexOf('AM') > -1 || value.indexOf('PM') > -1) {
			//If time is already in standard time then don't format.
			return value;
		} else {
			if (value.length == 8) {
				//If value is the expected length for military time then process to standard time.
				var hour = value.substring(0, 2); //Extract hour
				var minutes = value.substring(3, 5); //Extract minutes
				var identifier = 'AM'; //Initialize AM PM identifier

				if (hour == 12) {
					//If hour is 12 then should set AM PM identifier to PM
					identifier = 'PM';
				}
				if (hour == 0) {
					//If hour is 0 then set to 12 for standard time 12 AM
					hour = 12;
				}
				if (hour > 12) {
					//If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
					hour = hour - 12;
					if (hour < 10) {
						hour = '0' + hour;
					}
					identifier = 'PM';
				}
				return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
			} else {
				//If value is not the expected length than just return the value as is
				return value;
			}
		}
	}
}

function removeBadNoteTextToDisplay(note) {
	var test = note.indexOf('\\r');
	note = note.replace(/[\n\r]/g, '');
	if (note.indexOf('\\n') != -1) {
		note = note.replace(/\\n/g, '\n');
	}
	if (note.indexOf('\\r') != -1) {
		note = note.replace(/\\r/g, ' ');
	}
	if (note.indexOf('"') != -1) {
		note = note.replace(/\"/g, '');
	}
	if (note.indexOf("'") != -1) {
		note = note.replace(/'/g, '');
	}
	if (note.indexOf('\\') != -1) {
		note = note.replace(/\\/g, '');
	}
	note = note.replace('&#9', '');
	note = note.replace('\t', '');
	note = note.replace(/\t/g, '');

	note = note;
	return note;
}

//Gets days between passed in date and current date
function daysBetweenDates(checkDate) {
	var oneDay = 24 * 60 * 60 * 1000;
	var todaysDate = new Date();
	if (checkDate == undefined) {
		var checkDate = new Date();
	}
	var changeDate = new Date(checkDate);

	return Math.floor((todaysDate.getTime() - changeDate.getTime()) / oneDay);
}

function formatDateForDatabaseSave(date) {
	var newDate = new Date(date);
	date = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
	return date;
}

function convertTimeToMilitaryNew(inputTime) {
	if (inputTime == '') {
		return '::00';
	}
	var time = inputTime;
	var hours = parseInt(time.match(/^(\d+)/)[1], 10);
	var minutes = parseInt(time.match(/:(\d+)/)[1], 10);
	var AMPM = time.match(/\s(.*)$/)[1];
	if (AMPM == 'PM' && hours < 12) hours = hours + 12;
	if (AMPM == 'AM' && hours == 12) hours = hours - 12;
	var sHours = hours.toString();
	var sMinutes = minutes.toString();
	if (hours < 10) sHours = '0' + sHours;
	if (minutes < 10) sMinutes = '0' + sMinutes;
	//alert(sHours + ":" + sMinutes);
	return [sHours, sMinutes, '00'].join(':');
}

// Convert the input AM/PM time to a 24-hour military time:
function convertTimeToMilitary(inputTime) {
	var amPM = '';
	var hour = '';
	var minute = '';
	var militaryTime = '';
	if (inputTime.length < 5 && inputTime != '') {
		inputTime = '0' + inputTime;
	}
	// Parse the input time into hours, minutes and AM/PM values:
	for (var i = 0; i < inputTime.length; i++) {
		if (isNaN(inputTime.charAt(i)) == false && inputTime.charAt(i) != ' ') {
			if (i < 2) {
				hour = hour + inputTime.charAt(i);
			}

			if (i == 3 || i == 4) {
				minute = minute + inputTime.charAt(i);
			}
		}

		if (inputTime.charAt(i) == 'A' || inputTime.charAt(i) == 'P' || inputTime.charAt(i) == 'M') {
			amPM = amPM + inputTime.charAt(i);
		}
	}

	// If a AM value, add 12 to the input hour:
	if (amPM == 'AM' && hour == '12') {
		hour = '00';
	}

	// If a PM value, add 12 to the input hour:
	if (amPM == 'PM') {
		if (hour != '00') {
			if (hour != '12') {
				var x = +hour;
				x = x + 12;
				hour = String(x);
			}
		}
	}

	// Create a military time from the input time format:
	militaryTime = hour + ':' + minute + ':00';

	return militaryTime;
}

//http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
function setSelectionRange(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	} else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
}

function setCaretToPos(input, pos) {
	setSelectionRange(input, pos, pos);
}

function getDeviceLocation(callback) {
	if (location.protocol === 'https:' || location.hostname === 'localhost') {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(callback, callback, { timeout: 3000 });
		} else {
			callback();
		}
	}
}

//New time enter code below
function setTimeToScreen(amOrPm) {
	var pmAM = amOrPm;
	var timeDigitsEntered = $('#timedisplayfield').val();
	var originId = '#' + $('.timebox').attr('fromid');
	if (timeDigitsEntered.length < 3) {
		timeDigitsEntered = timeDigitsEntered + ':00';
	} else {
		timeDigitsEntered = timeDigitsEntered.substring(0, timeDigitsEntered.length - 2) + ':' + timeDigitsEntered.slice(-2);
	}
	if (timeDigitsEntered.length < 5) {
		timeDigitsEntered = '0' + timeDigitsEntered;
	}
	timeDigitsEntered = timeDigitsEntered + ' ' + pmAM;
	var opts = $('.timebox').data('opts');
	var increment = opts.increment;
	var minutes = timeDigitsEntered.split(':')[1].split(' ')[0];
	var hours = timeDigitsEntered.split(':')[0];
	if (increment != 0 && increment != undefined) {
		if (parseInt(minutes, 10) % increment != 0) {
			return $.fn.PSmodal({
				body: opts.incrementMessage,
				immediate: true,
				closeOnBlur: false,
				buttons: [
					{
						text: 'OK',
						callback: function() {},
					},
				],
			});
		}
	}
	if (parseInt(hours, 10) > 12) {
		return $.fn.PSmodal({
			body: 'You have entered invalid hours. Please correct this.',
			immediate: true,
			closeOnBlur: false,
			buttons: [
				{
					text: 'OK',
					callback: function() {},
				},
			],
		});
	}
	if (parseInt(minutes, 10) > 59) {
		return $.fn.PSmodal({
			body: 'You have entered invalid minutes. Please correct this.',
			immediate: true,
			closeOnBlur: false,
			buttons: [
				{
					text: 'OK',
					callback: function() {},
				},
			],
		});
	}
	if (opts.callback) {
		opts.callback(timeDigitsEntered);
	} else {
		$(originId).val(timeDigitsEntered);
		$(originId).html(timeDigitsEntered);
		$(originId).text(timeDigitsEntered);
		$(originId).change();
	}

	$('#timeoverlay').remove();
}

function setupTimeInputBox(obj, event, opts) {
	URL = '/webroot/dist/templates/timeinputpad.html'; // adjust path
	$.ajax({
		type: 'GET',
		url: URL + '?RNG=' + +new Date(),
		success: function(response) {
			html = response;
			displayTimeBox(
				html,
				obj,
				event,
				opts || {
					increment: 0,
					incrementMessage: '',
				}
			);
		},
	});
}

function displayTimeBox(html, obj, event, opts) {
	var x, y;
	if ($.mobile) {
		x = 20;
		y = 20;
	} else {
		x = event.x - 50;
		y = event.y - 16;
		$('#timeinputkeypad').css('zoom', '125%');
	}
	var overlay = $("<div id='timeoverlay'>")
		.css({
			backgroundColor: 'rgba(0, 0, 0, 0.15)',
			position: 'absolute',
			top: '0',
			bottom: '0',
			left: '0',
			right: '0',
			zIndex: '99999',
		})
		.click(function() {
			$(this).remove();
			return false;
		});
	var timeBox = $('<div fromid="' + obj[0].id + '" class="timebox">' + html + '</div>')
		.click(function(e) {
			return false;
		})
		.data('opts', opts);

	timeBox.css({
		opacity: '1.0 !important',
		marginLeft: x,
		marginTop: y,
	});

	overlay.append(timeBox);
	$('body').append(overlay);
}

function clearTimepadInputField() {
	$('#timedisplayfield').val('');
}

function convertDaysBack(daysBackIn) {
	var dateOffset = 24 * 60 * 60 * 1000 * daysBackIn;
	var daysBackDate = new Date();
	daysBackDate.setTime(daysBackDate.getTime() - dateOffset);
	var dateToPass = daysBackDate.getFullYear() + '-' + UTIL.leadingZero(daysBackDate.getMonth() + 1) + '-' + UTIL.leadingZero(daysBackDate.getDate());
	return dateToPass;
}

function convertDaysBackGoals(daysBackIn) {
	var dateOffset = 24 * 60 * 60 * 1000 * daysBackIn;
	var daysBackDate = new Date();
	daysBackDate.setTime(daysBackDate.getTime() - dateOffset);
	if (daysBackIn < 31) {
		return new Date(daysBackDate.getFullYear(), daysBackDate.getMonth(), daysBackDate.getDate());
	} else {
		return new Date(daysBackDate.getFullYear(), daysBackDate.getMonth() + 1, daysBackDate.getDate());
	}
}

function popupCalendar(opts) {
	var minDate = opts.minDate || null,
		maxDate = opts.maxDate || null,
		currVal = opts.currVal || null,
		callback = opts.callback || function() {},
		target = opts.target;

	var obj = {
		dateFormat: 'mm/dd/yy',
		theme: 'wp',
		accent: 'steel',
		display: 'bubble',
		mode: 'scroller',
		preset: 'date',
		onSelect: function(valueText, inst) {
			target.text(valueText);
			callback();
		},
		onShow: function() {
			if (currVal != null) {
				$(this).scroller('setDate', new Date(currVal.getFullYear(), currVal.getMonth(), currVal.getDate()), false);
			}

			$('.dw-arr').css('display', 'none');
		},
	};

	if (minDate != null) {
		obj.minDate = minDate;
	}

	if (maxDate != null) {
		obj.maxDate = maxDate;
	}

	target
		.mobiscroll()
		.date(obj)
		.mobiscroll('show');
}

function openCaraSolva() {
	var form = $('<form />', {
		action: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/CaraSolvaSignIn/',
		method: 'POST',
		target: '_blank',
		enctype: 'application/json',
	});
	form.hide().append("<input name='token' id='token' value='" + $.session.Token + "' />");
	form.appendTo($('body'));
	form.submit();
}

(function(scope) {
	if (!scope.Anywhere) {
		scope.Anywhere = {};
	}
	scope.Anywhere.promptYesNo = function(message, yesCallback, noCallback) {
		$.fn.PSmodal({
			body: message,
			immediate: true,
			buttons: [
				{
					text: 'Yes',
					callback: function() {
						if (yesCallback) yesCallback();
					},
				},
				{
					text: 'No',
					callback: function() {
						if (noCallback) noCallback();
					},
				},
			],
		});
	};
})(window);
