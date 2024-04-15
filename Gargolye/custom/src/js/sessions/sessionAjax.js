function generateURL(endPoint) {
  return `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/${endPoint}/`;
}

function logIn() {
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.classList.add('disabled');
    //need to check if code exists on device, pass either it or empty string
    const userId = $('#username').val().trim();
    const localDeviceId = UTIL.LS.getStorage('device', userId);
    const insertData = {
        userId: userId,
        hash: $().crypt({
            method: 'md5',
            source: $('#password1').val().trim()
        }),
        deviceId: localDeviceId ? localDeviceId : ''
    };
    var success = false;
    $.ajax({
        type: 'POST',
        url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getLogIn/',
        data: JSON.stringify(insertData),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            // show gif here, eg:
            $('body').css('cursor', 'wait');
        },
        dataType: 'json',
        success: function (response, status, xhr) {
            loginBtn.classList.remove('disabled');
            const res = JSON.stringify(response);
            if (res.indexOf(null) != -1) {
                $('#error').css('opacity', '1');
                $('#error').css('display', 'block');
                const message = `
				Please enter a valid username. 
				`;
                $('#errortext').text(message);
                return;
            }
            const resXML = response.getLogInResult && UTIL.parseXml(response.getLogInResult);
            if (resXML) {
                const windowName = resXML.getElementsByTagName('window_name')[0];
                if (windowName && windowName.innerHTML === 'Failed attempts') {
                    const count = resXML.getElementsByTagName('special_data')[0].innerHTML;
                    // $('#error').css('opacity', '1');
                    // $('#error').css('display', 'block');
                    // $('#errortext').text('Invalid username/password combination');

                    const overlay = document.querySelector('.overlay');
                    const loginWarningPopup = POPUP.build({
                        id: 'loginPopup',
                        hideX: true
                    });
                    const okButton = button.build({
                        text: 'ok',
                        type: 'contained',
                        style: 'secondary',
                        callback: function () {
                            overlay.classList.remove('visible');
                            document.body.removeChild(loginWarningPopup);
                            document.getElementById('password1').value = '';
                            document.getElementById('password1').focus();
                        }
                    });
                    const message = document.createElement('p');
                    switch (count) {
                        case '1':
                            {
                                message.innerHTML = `Invalid user name or password.`;
                                break;
                            }
                        case '2':
                            {
                                message.innerHTML = `This is your second failed login attempt. If you have one more failed attempt your account will become inactive. Please use the Forgot Password link below to reset your password.`;
                                break;
                            }
                        case '3':
                            {
                                message.innerHTML = `Your account is inactive due to the number of failed login attempts. Please contact your System Administrator to enable your account.`;
                                break;
                            }
                        default:
                            {
                                message.innerHTML = `Your account is inactive due to the number of failed login attempts. Please contact your System Administrator to enable your account.`;
                            }
                    }
                    loginWarningPopup.appendChild(message);
                    loginWarningPopup.appendChild(okButton);
                    overlay.classList.add('visible');
                    document.body.appendChild(loginWarningPopup);
                    okButton.focus();
                } else if (windowName && windowName.innerHTML === 'Not active') {
                    const overlay = document.querySelector('.overlay');
                    const loginWarningPopup = POPUP.build({
                        id: 'loginPopup',
                        hideX: true
                    });
                    const okButton = button.build({
                        text: 'ok',
                        type: 'contained',
                        style: 'secondary',
                        callback: function () {
                            overlay.classList.remove('visible');
                            document.body.removeChild(loginWarningPopup);
                            //document.getElementById("username").value = '';
                            document.getElementById('password1').value = '';
                            document.getElementById('username').focus();
                        }
                    });
                    const message = document.createElement('p');
                    message.innerHTML = `Your account is inactive. Please contact your System Administrator to enable your account.`;
                    loginWarningPopup.appendChild(message);
                    loginWarningPopup.appendChild(okButton);
                    overlay.classList.add('visible');
                    document.body.appendChild(loginWarningPopup);
                    okButton.focus();
                } else if (windowName && windowName.innerHTML === 'Invalid username') {
                    const overlay = document.querySelector('.overlay');
                    const loginWarningPopup = POPUP.build({
                        id: 'loginPopup',
                        hideX: true
                    });
                    const username = document.getElementById('username').value;
                    const okButton = button.build({
                        text: 'ok',
                        type: 'contained',
                        style: 'secondary',
                        callback: function () {
                            overlay.classList.remove('visible');
                            document.body.removeChild(loginWarningPopup);
                            //document.getElementById("username").value = '';
                            document.getElementById('password1').value = '';
                            document.getElementById('username').focus();
                        }
                    });
                    const message = document.createElement('p');
                    message.innerHTML = `Invalid user name or password.`;
                    loginWarningPopup.appendChild(message);
                    loginWarningPopup.appendChild(okButton);
                    overlay.classList.add('visible');
                    document.body.appendChild(loginWarningPopup);
                    okButton.focus();
                } else {
                    if (windowName && windowName.innerHTML === '2FA') {
                        //Call below method from the popup. insertData must userName and genKey
                        const deviceId = resXML.getElementsByTagName('special_data')[0].innerHTML;
                        //const deviceId = JSON.parse(response.getLogInResult)[0]['@deviceGUID'];
                        if (localDeviceId !== deviceId) {
                            // UTIL.LS.setStorage('device', deviceId, userId);
                            $.session.deviceGUID = deviceId;
                            mfa.init();
                        } else {
                            eraseCookie('psiuser');
                            var overlay = document.createElement('div');
                            if ($('#username').val().toUpperCase() == 'PSI') {
                                $.session.isPSI = true;
                                eraseCookie('psi');
                                createCookie('psi', res, 1);
                                createCookie('psiuser', res, 1);
                                success = true;
                                document.location.href = 'anywhere.html';
                            } else {
                                eraseCookie('psi');
                                createCookie('psi', res, 1);
                                success = true;
                                document.location.href = 'anywhere.html';
                            }
                        }
                        //authenticatedLogin();
                    } else if (windowName && windowName.innerHTML === 'Invalid username') {
                        $('#error').css('opacity', '1');
                        $('#error').css('display', 'block');
                        $('#errortext').text('Invalid username/password combination');
                    } else if (res.indexOf('Invalid password') != -1) {
                        //never will be hit, needs removed
                        $('#error').css('opacity', '1');
                        $('#error').css('display', 'block');
                        $('#errortext').text('Invalid password attempt 1');
                    } else if (windowName && windowName.innerHTML === 'No demographics record') {
                        $('#error').css('opacity', '1');
                        $('#error').css('display', 'block');
                        $('#errortext').text('There is no Name in Demographics defined for your user. Please contact your system administrator to login to Anywhere.');
                    } else if (windowName && windowName.innerHTML === 'No recipient') {
                        $('#error').css('opacity', '1');
                        $('#error').css('display', 'block');
                        const message = `
              Two-Factor authentication is enabled for your organization.
              There was no valid email address or cell phone number found for your account.
              Please contact your system administrator to login to Anywhere. 
              `;
                        $('#errortext').text(message);
                    } else if (windowName && windowName.innerHTML === 'Expired password') {
                        customPasswordChange();
                    } else {
                        //errorMessage = "";
                        //alert('success: ' + res);
                        eraseCookie('psiuser');
                        var overlay = document.createElement('div');
                        if ($('permissions', res).is('*') && $('#username').val().toUpperCase() == 'PSI') {
                            $.session.isPSI = true;
                            eraseCookie('psi');
                            createCookie('psi', res, 1);
                            createCookie('psiuser', res, 1);
                            success = true;
                            document.location.href = 'anywhere.html';
                        } else if ($('permissions', res).is('*') && checkforErrors(res) == 0) {
                            eraseCookie('psi');
                            createCookie('psi', res, 1);
                            success = true;
                            document.location.href = 'anywhere.html';
                        } else if (res.indexOf('609') > -1) {
                            //$("#error").css("display", "block");
                            //checkForErrors();
                            customPasswordChange();
                        } else {
                            $('#error').css('opacity', '1');
                            $('#error').css('display', 'block');
                            if ($('#error').hasClass('hippaRestriction')) {
                                $('#errortext').text('Password cannot match a recently used password');
                            } else if ($('#error').hasClass('userInputError')) {
                                $('#errortext').text('Invalid username or password');
                            } else if (res.indexOf('608') > -1) {
                                $('#errortext').text('This user name does not exist in demographics.');
                            } else {
                                $('#errortext').text('Login unsuccessful');
                            }
                        }
                    }
                }
            }
        },
        complete: function () {
            // hide gif here, eg:
            $('body').css('cursor', 'auto');
        }
    });
    //postError("100", "This is a tricky error", "DEBUG");
}

//Shared functionality of log in for use with change password, because of the ids for username and password on the forms
function logInChangePassword() {
  var success = false;
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/getLogIn/',
    data:
      '{"userId":"' +
      $('#username2').val() +
      '", "hash":"' +
      $().crypt({
        method: 'md5',
        source: $('#newpassword2').val(),
      }) +
      '"}',
    contentType: 'application/json; charset=utf-8',
    beforeSend: function () {
      // show gif here, eg:
      $('body').css('cursor', 'wait');
    },
    dataType: 'json',
    success: function (response, status, xhr) {
      var res = JSON.stringify(response);
      //errorMessage = "";
      //alert('success: ' + res);
      eraseCookie('psiuser');
      var overlay = document.createElement('div');
      if ($('permissions', res).is('*') && $('#username2').val().toUpperCase() == 'PSI') {
        eraseCookie('psi');
        createCookie('psi', res, 1);
        success = true;
        createCookie('psiuser', res, 1);
        document.location.href = 'anywhere.html';
      } else if ($('permissions', res).is('*') && checkforErrors(res) == 0) {
        eraseCookie('psi');
        createCookie('psi', res, 1);
        success = true;
        document.location.href = 'anywhere.html';
      } else {
        $('#error').css('opacity', '1');
        $('#error').css('display', 'block');
        if ($('#error').hasClass('hippaRestriction')) {
          $('#errortext').text('Password cannot match a recently used password');
        } else if ($('#error').hasClass('userInputError')) {
          $('#errortext').text('Invalid username or password');
        } else {
          $('#errortext').text('Login unsuccessful');
        }
      }
    },
    error: function (xhr, status, error) {},
    complete: function () {
      // hide gif here, eg:
      $('body').css('cursor', 'auto');
    },
  });
  //postError("100", "This is a tricky error", "DEBUG");
}

function patchIt() {
  logIn();
}

//Added to get value as to whether or not a strong password is required and the length of password required
function strongPasswordValue() {
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/getStrongPassword/',
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      var res = JSON.stringify(response);
      //Had to do this way because both fields are in database under same column name in system settings
      var passwordInfo = $('results', res);
      $.session.strongPassword = passwordInfo[0].innerText;
      $.session.passwordSpecialCharacters = passwordInfo[1].innerText;
      $.session.advancedPasswordLength = passwordInfo[2].innerText;
    },
    error: function (xhr, status, error) {
      //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
    },
  });
}

function getCustomLoginTextAndVersion(callback) {
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/getCustomTextAndAnywhereVersion/',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      var res = response.getCustomTextAndAnywhereVersionResult.replace(/\r/g, '').replace(/\n/g, '<br>');
      //var res = JSON.stringify(response);
      callback(res);
    },
    error: function (xhr, status, error) {
      $('#customLoginText').text(
        'Primary Solutions, in conjunction with amazing people like you, has built a new product from the ground up that ' +
          "focuses on ease of use so that you can focus on what's really important.",
      );
      //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
    },
  });
}

function changeIt() {
    const changeBtn = document.getElementById('changebutton');
    changeBtn.classList.add('disabled');
    if (checkPass() == 0) return;
    //changeBtn.classList.add('disabled');
    let newPW = $('#newpassword1').val();
    newPW = newPW.replaceAll(`\\`, `\\\\`);
    newPW = newPW.replaceAll(`"`, `\\"`);
    newPW = newPW.replaceAll(`'`, `''`);
    var success = false;
    let passwordChangeError = false;
    let inactiveUser = false;
    let passwordReuseError = false;
    // blur focus to prevent messages from getting removed too quickly
    document.activeElement.blur();
    //alert('patchIt');
    $.ajax({
        type: 'POST',
        url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/changeLogIn/',
        data: '{"userId":"' + $('#username2').val() + '", "hash":"' + $().crypt({
            method: 'md5',
            source: $('#password2').val()
        }) + '", "newPassword":"' + newPW + '", "changingToHashPassword":"' + $().crypt({
            method: 'md5',
            source: $('#newpassword1').val()
        }) + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (res.indexOf(null) != -1) {
                passwordChangeError = true;
                return;
            }
            //alert('success: ' + res);
            if (res.indexOf('Not active') != -1) {
                $('#error').css('opacity', '1');
                $('#error').css('display', 'block');
                const message = `
				Your account is inactive. Please contact your System Administrator to enable your account. 
				`;
                $('#errortext').text(message);
                inactiveUser = true;
                return;
            }
            if (res.indexOf('Error:611') > -1) {
                passwordReuseError = true;
                $('#error').css('opacity', '1');
                $('#error').css('display', 'block');
                const message = `
				Your new password does not meet your organizations password reuse rules. Please use a different password.
				`;
                $('#errortext').text(message);
                return;
            } else if (res.indexOf('Error:610') > -1) {
                passwordChangeError = true;
                $('#error').addClass('userInputError');
                $('#error').removeClass('hippaRestriction');
            } else {
                $('#error').removeClass('hippaRestriction');
                $('#error').removeClass('userInputError');
            }
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
        complete: function () {
            changeBtn.classList.remove('disabled');
            if (inactiveUser || passwordReuseError) {
                return;
            }
            if (passwordChangeError) {
                $('#error').css('opacity', '1');
                $('#error').css('display', 'block');
                const message = `
				Invalid user name or password. 
				`;
                $('#errortext').text(message);
                return;
            }
            overlay.init();
            $('#password1').val($('#newpassword1').val());
            const mainElement = document.getElementsByTagName('main')[0];
            const passwordChangeConfPOPUP = POPUP.build({
                hideX: true
            });
            const okBtn = button.build({
                text: 'OK',
                style: 'secondary',
                type: 'contained',
                callback: () => {
                    mainElement.removeChild(passwordChangeConfPOPUP);
                    overlay.hide();
                    bodyScrollLock.enableBodyScroll(passwordChangeConfPOPUP);
                    document.body.style.overflow = 'visible';
                    backToLoginPage();
                }
            });
            okBtn.style.width = '100%';
            const message = document.createElement('p');
            message.innerText = 'Password has been changed. You may now log in with your new password.';
            message.style.textAlign = 'center';
            message.style.marginBottom = '15px';
            passwordChangeConfPOPUP.appendChild(message);
            passwordChangeConfPOPUP.appendChild(okBtn);
            // disable scrolling
            bodyScrollLock.disableBodyScroll(passwordChangeConfPOPUP);
            // show overlay
            const overlayElement = document.querySelector('.overlay');
            overlayElement.style.zIndex = '2';
            passwordChangeConfPOPUP.style.zIndex = '3';
            passwordChangeConfPOPUP.style.top = '40%';
            overlay.show();
            mainElement.appendChild(passwordChangeConfPOPUP);
            // focus on ok button
            okBtn.focus();
        }
    });
}

function resetIt() {
    if ($.session.changeEmailSent) {
        return;
    }
    $('#resetButton').prop('disabled', true);
    $.ajax({
        type: 'POST',
        url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/setupPasswordResetEmail/',
        data: '{"userName":"' + $('#username3').val() + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (res.indexOf(null) != -1) {
                $('#error').css('opacity', '1');
                $('#error').css('display', 'block');
                const message = `
				Please enter a valid username. 
				`;
                $('#errortext').text(message);
                return;
            }
            if (res.indexOf('Inactive user') != -1) {
                $('#error').css('opacity', '1');
                $('#error').css('display', 'block');
                const message = `
				Your account is inactive. Please contact your System Administrator to enable your account. 
				`;
                $('#errortext').text(message);
                return;
            }
            if (res.indexOf('No recipient') != -1) {
                $('#error').css('opacity', '1');
                $('#error').css('display', 'block');
                const message = `
				There was no valid email address found for your account.
				Please contact your system administrator to login to Anywhere. 
				`;
                $('#errortext').text(message);
                return;
            }
            setUpPasswordResetMessages(res);
            $('#resetButton').prop('disabled', false);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
        }
    });
}

function tokenCheck() {
  var success = false;
  //alert('checking token');
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/tokenCheck/',
    data: '{"token":"' + $.session.Token + '"}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      var res = JSON.stringify(response);
      //alert('success: ' + res);
      if (res.indexOf('607') > -1 || res.indexOf('606') > -1) {
        document.location.href = 'login.html';
      } else {
        success = true;
      }
    },
    //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
  });
}

function postError(errNum, errMsg, errLvl) {
  var d = new Date();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var strDate = d.getDate() + '-' + curr_month + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
  var dataString =
    't=' +
    strDate +
    '&l=' +
    'client' +
    '&u=' +
    $.session.Name +
    ' ' +
    $.session.LName +
    '&en=' +
    errNum +
    '&em=' +
    errMsg +
    '&s=' +
    errLvl;
  //$.ajax({
  //  type: "POST",
  //  url: http://anyerr.primarysolutions.net/Default.aspx,  //$.webServer.anyerr,
  //  data: dataString,
  //  success: function() {
  //  }
  //});
}

function saveDefaultLocationValueAjax(switchCase, locationId) {
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/saveDefaultLocationValue/',
    data: '{"token":"' + $.session.Token + '", "switchCase":"' + switchCase + '", "locationId":"' + locationId + '"}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      var res = JSON.stringify(response);
    },
    //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
  });
}

function saveDefaultLocationNameAjax(switchCase, locationName) {
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/saveDefaultLocationName/',
    data:
      '{"token":"' + $.session.Token + '", "switchCase":"' + switchCase + '", "locationName":"' + locationName + '"}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      var res = JSON.stringify(response);
    },
    //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
  });
}

function updateVersionAjax() {
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/updateVersion/',
    data: '{"token":"' + $.session.Token + '", "version":"' + $.session.version + '"}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      var res = JSON.stringify(response);
    },
    //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
  });
}

//Infal  login. Will look differently and possibly be moved. Putting here for functionality tests.
function checkLogin() {
  $.ajax({
    type: 'POST',
    //url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
    //    "/" + $.webServer.serviceName + "/getURL/",
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/ValidateLogin/',
    data: '{"id":"' + $('#userIDInfal').val() + '"}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      var res = JSON.stringify(response);
      allowAccess(res);
    },
    error: function (xhr, status, error) {
      //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
    },
  });
}

//Going to call on login to see if a connection for Infal exists in the webconfig
function checkInfalConnectionAjax(callback) {
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/CheckInfalConnection/',
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      if (response.CheckInfalConnectionResult == 'Connection') {
        $.session.infalHasConnectionString = true;
      }
      if ($.session.infalOnly) {
        dashboard.load();
      }
    },
    error: function (xhr, status, error) {
      //callback(error, null);
    },
  });
}

//Gets user permissions pertaining to what modules they can see.
function getUserPermissions(callback) {
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/getUserPermissions/',
    data: '{"token":"' + $.session.Token + '"}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
      success: function (response, status, xhr) {

      $.session.permissionString = response.getUserPermissionsResult;

      const caseNotesPerm = $.session.permissionString.find(obj => obj.window_name === 'EnableCaseNotes');
      const supervisorPerm = $.session.permissionString.find(obj => obj.window_name === 'Supervisor');
      const docTimePerm = $.session.permissionString.find(obj => obj.window_name === 'UpdateDocTime');
      const caseNoteDocTimePerm = $.session.permissionString.find(obj => obj.window_name === 'Anywhere Case Notes');
      const adminSEPerm = $.session.permissionString.find(obj => obj.window_name === 'SESupervisorApprove');

      $.session.CaseNotesTablePermissionView = caseNotesPerm && caseNotesPerm.permission === 'Y' ? true : false;
      $.session.ViewAdminSingleEntry = supervisorPerm && supervisorPerm.permission === 'Y' ? true : false;
      $.session.UpdateCaseNotesDocTime =
        docTimePerm &&
        caseNoteDocTimePerm &&
        docTimePerm.permission === 'Update Doc Time' &&
        caseNoteDocTimePerm.permission === 'Update Doc Time'
          ? true
          : false;
      $.session.SEViewAdminWidget = adminSEPerm && adminSEPerm.permission === 'Y' ? true : false;

      setSessionVariables();

      //check to see which modules should be disabled
      checkModulePermissions();

      if (callback) callback();

      $('#userName').text($.session.Name);
      $('#firstName').text($.session.Name);
      $('#lastName').text($.session.LName);
    },
  });
}

function featureLogging(appName) {
  if (appName != 'roster') {
    var featureDescription = 'Anywhere ' + appName;
    $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/featureLogging/',
      data: '{"token":"' + $.session.Token + '","featureDescription":"' + featureDescription + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
}

function getDefaultAnywhereSettings() {
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/getDefaultAnywhereSettingsJSON/',
    data: '{"token":"' + $.session.Token + '"}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      res = response.getDefaultAnywhereSettingsJSONResult;
      res = res[0];

      $.session.anAdmin = res.admistrator;
      $.session.defaultCaseNoteReviewDays = res.setting_value === '' ? '7' : res.setting_value;
      $.session.defaultProgressNoteReviewDays = res.notes_days_back === '' ? '99' : res.notes_days_back;
      $.session.defaultIncidentTrackingDaysBack =
        res.incidentTracking_days_back === '' ? '7' : res.incidentTracking_days_back;
      $.session.defaultProgressNoteChecklistReviewDays = res.checklist_days_back === '' ? '7' : res.checklist_days_back;
      $.session.anywhereMinutestotimeout = res.minutesToTimeout === '' ? '15' : res.minutesToTimeout;
      $.session.removeGoalsWidget = res.removeGoalsWidget === 'Y' ? true : false;
      $.session.seAdminRemoveMap = res.removeSEAdminMap === 'Y' ? true : false;
      $.session.isASupervisor = res.isASupervisor === '' ? false : true;
      $.session.sttEnabled = res.sttEnabled === 'Y' ? true : false;
      $.session.azureSTTApi = res.azureSttApi;
      $.session.reportSeconds = res.reportSeconds;
      $.session.incidentTrackingPopulateIncidentDate = res.incidentTrackingPopulateIncidentDate;
      $.session.incidentTrackingPopulateIncidentTime = res.incidentTrackingPopulateIncidentTime;
      $.session.incidentTrackingPopulateReportedDate = res.incidentTrackingPopulateReportedDate;
      $.session.incidentTrackingPopulateReportedTime = res.incidentTrackingPopulateReportedTime;

      $.session.incidentTrackingShowCauseAndContributingFactors =
        res.incidentTrackingShowCauseAndContributingFactors === 'Y' ? true : false;
      $.session.incidentTrackingShowPreventionPlan = res.incidentTrackingShowPreventionPlan === 'Y' ? true : false;

      $.session.updateIncidentSummaryText = res.appendITSummary === 'Y' ? true : false;
      $.session.updateIncidentActionText = res.appendITImmediateAction === 'Y' ? true : false;
      $.session.updateIncidentPreventionText = res.appendITPreventionPlan === 'Y' ? true : false;
      $.session.updateIncidentCauseText = res.appendITCause === 'Y' ? true : false;
      $.session.planFormCarryover = res.planFormCarryover === 'Y' ? true : false;
      //Waiting List
      $.session.sendWaitingListEmail = res.sendWaitingListEmail === 'Y' ? true : false;
      //Hide stuff
      $.session.useAbsentFeature = res.useAbsentFeature;
      $.session.useProgressNotes = res.useProgressNotes;
      $.session.applicationName = res.application;
      $.session.portraitPath = res.portraitPath;
      $.session.anywhereMainPermission = res.anywhereMainPermission;
      $.session.outcomesPermission = res.outcomesPermission;
      $.session.dayServicesPermission = res.dayServicesPermission;
      $.session.caseNotesPermission = res.caseNotesPermission;
      $.session.incidentTrackingPermission = res.incidentTrackingPermission;
      $.session.singleEntryPermission = res.singleEntryPermission;
      $.session.workshopPermission = res.workshopPermission;
      $.session.intellivuePermission = res.intellivuePermission;
      $.session.schedulingPermission = res.schedulingPermission;
      $.session.anywhereSchedulingPermission = res.anywhereSchedulingPermission;
      $.session.covidPermission = res.covidPermission;
      $.session.webPermission = res.webPermission; //Should be set equal to Web when true
      $.session.transportationPermission = res.transportationPermission;
      $.session.emarPermission = res.emarPermission;
      $.session.formsPermission = res.formsPermission;
      $.session.OODPermission = res.OODPermission;
      // TODO: ASH
      //$.session.anywhereAuthorizationsPermission = res.anywhereAuthorizationsPermission;
      $.session.anywherePlanPermission = res.anywherePlanPermission;
      $.session.singleEntryApproveEnabled = res.singleEntryApproveEnabled;
      $.session.singleEntryLocationRequired = res.singleEntryLocationRequired;
      $.session.singleEntryShowConsumerSignature = res.seShowConsumerSignature;
      $.session.singleEntryShowConsumerNote = res.seShowConsumerNote;
      $.session.singleEntryShowTransportation = res.seShowTransportation;
      $.session.schedAllowCallOffRequests = res.allowCallOffRequests;
      $.session.schedRequestOpenShifts = res.requestOpenShifts;
      $.session.oneSpan = res.oneSpan;

      $.session.anywhereResetPasswordPermission = res.anywhereResetPasswordPermission;
      $.session.anywhereConsumerFinancesPermission = res.anywhereConsumerFinancesPermission;
      $.session.anywhereEmploymentPermission = res.anywhereEmploymentPermission;
      //Default Work
      //.session.
      $.session.defaultRosterLocation = res.defaultrosterlocation;
      $.session.defaultRosterLocationName = res.defaultrosterlocationname;
      $.session.defaultRosterGroupValue = res.defaultrostergroup;
      $.session.defaultDayServiceLocation =
        res.defaultdayservicelocation === 'notDSCertified' ? '' : res.defaultdayservicelocation;
      $.session.defaultDayServiceLocationName = res.defaultdayservicelocationname;
      $.session.dsCertified = res.defaulttimeclocklocation === 'notDSCertified' ? false : true;
      $.session.defaultDSTimeClockValue = res.defaulttimeclocklocation;
      $.session.defaultDSTimeClockName = res.defaulttimeclocklocationName;
      $.session.defaultWorkshopLocationValue = res.defaultworkshoplocation;
      $.session.defaultWorkshopLocation = res.defaultworkshoplocationname;
      $.session.defaultMoneyManagementLocationValue = res.defaultMoneyManagementLocation;
      $.session.defaultMoneyManagementLocation = res.defaultMoneyManagementLocationName; 
      //$.session.defaultDSTimeClockName = res.defaulttimeclocklocationname;
      //database state - Indiana or Ohio
      $.session.stateAbbreviation = res.stateAbbreviation;
      //Set session peopleId for use in ADV Plan
      $.session.planPeopleId = res.planPeopleId;

      if ($.session.applicationName === 'Gatekeeper') {
        $.session.caseNotesWarningStartTime = res.warningStartTime;
        $.session.caseNotesWarningEndTime = res.warningEndTime;
      }

      /////////
      defaultRosterLocationValue = res.defaultrosterlocation;
      defaultRosterLocationName = res.defaultrosterlocationname;
      defaultDayServiceLocationValue = res.defaultdayservicelocation;
      defaultDayServiceLocationName = res.defaultdayservicelocationname;
      defaultTimeClockLocationValue = res.defaulttimeclocklocation;
      defaultTimeClockLocationName = res.defaulttimeclocklocationname;
      defaultWorkshopLocationValue = res.defaultworkshoplocation;
      defaultWorkshopLocationName = res.defaultworkshoplocationname;
      defaultRosterGroupValue = res.defaultrostergroup;
      defaultRosterGroupName = res.defaultrostergroupname;
      $.session.defaultWorkshopLocation = defaultWorkshopLocationName;

      //setDefaultCookies(
      //	defaultRosterLocationValue,
      //	defaultRosterLocationName,
      //	defaultDayServiceLocationValue,
      //	defaultDayServiceLocationName,
      //	defaultTimeClockLocationValue,
      //	defaultTimeClockLocationName,
      //	defaultWorkshopLocationValue,
      //	defaultWorkshopLocationName,
      //	defaultRosterGroupValue,
      //	defaultRosterGroupName
      //);

      $('#casenotesdaysback').val($.session.defaultCaseNoteReviewDays);
      $('#progressnotesdaysback').val($.session.defaultProgressNoteReviewDays);
      $('#progressnoteschecklistdaysback').val($.session.defaultProgressNoteChecklistReviewDays);
      $('#incidenttrackingdaysback').val($.session.defaultIncidentTrackingDaysBack);

      disableModules();
      loadApp('home');
    },
    error: function (xhr, status, error) {
      //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
    },
  });
}

//function setDefaultCookies(
//	defaultRosterLocationValue,
//	defaultRosterLocationName,
//	defaultDayServiceLocationValue,
//	defaultDayServiceLocationName,
//	defaultTimeClockLocationValue,
//	defaultTimeClockLocationName,
//	defaultWorkshopLocationValue,
//	defaultWorkshopLocationName,
//	defaultRosterGroupValue,
//	defaultRosterGroupName
//) {
//	createCookie('defaultDayServiceLocation', defaultDayServiceLocationValue, 7);
//	createCookie('defaultDayServiceLocationName', defaultDayServiceLocationName, 7);
//	createCookie('defaultDayServiceLocationNameValue', defaultDayServiceLocationValue, 7);

//	if (defaultDayServiceLocationName == 'Remember Last Location') {
//		createCookie('defaultDayServiceLocationFlag', true, 7);
//	} else {
//		createCookie('defaultDayServiceLocationFlag', false, 7);
//	}

//	createCookie('defaultRosterLocation', defaultRosterLocationValue, 7);
//	createCookie('defaultRosterLocationName', defaultRosterLocationName, 7);

//	if (defaultRosterLocationName == 'Remember Last Location') {
//		createCookie('defaultRosterLocationFlag', true, 7);
//	} else {
//		createCookie('defaultRosterLocationFlag', false, 7);
//	}

//	if (defaultWorkshopLocationName == 'Remember Last Location') {
//		createCookie('defaultWorkshopLocationFlag', true, 7);
//	} else {
//		createCookie('defaultWorkshopLocationFlag', false, 7);
//	}

//	createCookie('defaultTimeClockLocationName', defaultTimeClockLocationName, 7);
//	createCookie('defaultTimeClockLocationValue', defaultTimeClockLocationValue, 7);
//	createCookie('defaultWorkshopLocationName', defaultWorkshopLocationName, 7);
//	createCookie('defaultWorkshopLocationValue', defaultWorkshopLocationValue, 7);
//	createCookie('defaultRosterGroupName', defaultRosterGroupName, 7);
//	createCookie('defaultRosterGroupValue', defaultRosterGroupValue, 7);
//}

function authenticatedLogin(key) {
  //insertData must userName and genKey
  const insertData = {
    userName: $('#username').val().trim(),
    genKey: key,
  };
  $.ajax({
    type: 'POST',
    url:
      $.webServer.protocol +
      '://' +
      $.webServer.address +
      ':' +
      $.webServer.port +
      '/' +
      $.webServer.serviceName +
      '/authenticatedLogin/',
    data: JSON.stringify(insertData),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response, status, xhr) {
      if (
        response.authenticatedLoginResult === 'Invalid key' ||
        response.authenticatedLoginResult === 'Too many failed attempts' ||
        response.authenticatedLoginResult === 'Expired key'
      ) {
        mfa.mfaReject(response.authenticatedLoginResult);
        return;
      }
      var res = JSON.stringify(response);
      eraseCookie('psiuser');
      if ($('permissions', res).is('*') && $('#username').val().toUpperCase() == 'PSI') {
        $.session.isPSI = true;
        eraseCookie('psi');
        createCookie('psi', res, 1);
        createCookie('psiuser', res, 1);
        success = true;
        document.location.href = 'anywhere.html';
      } else if ($('permissions', res).is('*') && checkforErrors(res) == 0) {
        UTIL.LS.setStorage('device', $.session.deviceGUID, $('#username').val());
        $.session.deviceGUID = '';
        eraseCookie('psi');
        createCookie('psi', res, 1);
        success = true;
        document.location.href = 'anywhere.html';
      } else if (res.indexOf('609') > -1) {
        customPasswordChange();
      } else {
        $('#error').css('opacity', '1');
        $('#error').css('display', 'block');
        if ($('#error').hasClass('hippaRestriction')) {
          $('#errortext').text('Password cannot match a recently used password');
        } else if ($('#error').hasClass('userInputError')) {
          $('#errortext').text('Invalid username or password');
        } else if (res.indexOf('608') > -1) {
          $('#errortext').text('This user name does not exist in demographics.');
        } else {
          $('#errortext').text('Login unsuccessful');
        }
      }
    },
    error: function (xhr, status, error) {},
    complete: function () {
      // hide gif here, eg:
      $('body').css('cursor', 'auto');
    },
  });
}
