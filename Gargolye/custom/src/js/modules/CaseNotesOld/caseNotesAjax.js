var caseNotesAjax = (function () {
  // GET
  function getFilteredCaseNotesList(data, callback) {
    const spinner = PROGRESS.SPINNER.get('Loading Overlaps...');
    const reviewTable = document.querySelector('#caseNotesReviewTable .table__body');
    const submitData = {
      token: $.session.Token,
      billerId: data.billerId,
      consumerId: data.consumer,
      serviceStartDate: data.serviceDateStart,
      serviceEndDate: data.serviceDateEnd,
      dateEnteredStart: data.enteredDateStart,
      dateEnteredEnd: data.enteredDateEnd,
      billingCode: data.billingCode,
      reviewStatus: data.reviewStatus,
      location: data.location,
      service: data.service,
      need: data.need,
      contact: data.contact,
      confidential: data.confidential,
      corrected: data.corrected,
      billed: data.billed,
      attachments: data.attachments,
      overlaps: data.overlaps,
      noteText: data.noteText !== '' ? `%${data.noteText}%` : '',
      applicationName: $.session.applicationName,
      outcomeServiceMonitoring: data.outcomeServiceMonitoring
    };
    if (data.overlaps === 'Y') {
      reviewTable.innerHTML = '';
      reviewTable.appendChild(spinner);
      spinner.style.top = 0;
    }

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
        '/caseNotesFilteredSearchJSON/',
      //     data:
      //         '{"token":"' +
      //         $.session.Token +
      //         '", "billerId":"' +
      //         data.billerId +
      //         '", "consumerId":"' +
      //         data.consumer +
      //         '", "serviceStartDate":"' +
      //         data.serviceDateStart +
      //         '", "serviceEndDate":"' +
      //         data.serviceDateEnd +
      //         '", "dateEnteredStart":"' +
      //         data.enteredDateStart +
      //         '", "dateEnteredEnd":"' +
      //         data.enteredDateEnd +
      //         '", "billingCode":"' +
      //         data.billingCode +
      //         '", "reviewStatus":"' +
      //         data.reviewStatus +
      //         '", "location":"' +
      //         data.location +
      //         '", "service":"' +
      //         data.service +
      //         '", "need":"' +
      //         data.need +
      //         '", "contact":"' +
      //         data.contact +
      //         '", "confidential":"' +
      //         data.confidential +
      //         '", "billed":"' +
      //         data.billed +
      //         '", "attachments":"' +
      //         data.attachments +
      //         '", "overlaps":"' +
      //         data.overlaps +
      //         '", "noteText":"' +
      //         data.noteText +
      // '"}',
      data: JSON.stringify(submitData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.caseNotesFilteredSearchJSONResult;
        callback(res);
      },
    });
  }
  function getCaseNoteEdit(noteId, callback) {
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
        '/getCaseNoteEditJSON/',
      data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getCaseNoteEditJSONResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getGroupNoteId(callback) {
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
        '/getGroupNoteId/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.parse(response.getGroupNoteIdResult);
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getDropdownData(callback) {
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
        '/populateDropdownData/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response;
        callback(res);
      },
    });
  }
  function getConsumersThatCanHaveMileage(callback) {
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
        '/getConsumersThatCanHaveMileageJSON/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getConsumersThatCanHaveMileageJSONResult;
        callback(res);
      },
    });
  }
  function getBillersListForDropDown(callback) {
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
        '/getBillersListForDropDownJSON/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getBillersListForDropDownJSONResult;
        // var allString = '<biller><billerId>000</billerId><billerName>All</billerName></biller>';
        // res = res.slice(0, 45) + allString + res.slice(45);
        // createBillerDropdown(res);
        callback(res);
        // if ($.session.CaseNotesCaseloadRestriction == false) {
        // 	convertDaysBackForCaseNoteLoadFilter($.session.defaultCaseNoteReviewDays);
        // }
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getReviewRequiredForCaseManager(caseManagerId, callback) {
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
        '/getReviewRequiredForCaseManager/',
      data: '{"token":"' + $.session.Token + '", "caseManagerId":"' + caseManagerId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
     //  var res = JSON.stringify(response);
       var res = response.getReviewRequiredForCaseManagerResult;
        callback(res);
      },
    });
  }
  function getCaseNoteAttachmentsList(caseNoteId, cb) {
    data = {
      token: $.session.Token,
      caseNoteId: caseNoteId,
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
        '/getCaseNoteAttachmentsList/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getCaseNoteAttachmentsListResult;
        cb(res);
      },
      error: function (xhr, status, error) {},
    });
  }
  function getConsumerSpecificVendors(consumerId, serviceDate, callback) {
    if (consumerId == '' || consumerId == undefined) {
      consumerId = $.session.caseNoteConsumerId;
    }
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
        '/getConsumerSpecificVendorsJSON/',
      data:
        '{"token":"' + $.session.Token + '", "consumerId":"' + consumerId + '", "serviceDate":"' + serviceDate + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getConsumerSpecificVendorsJSONResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getServiceLocationsForCaseNoteDropDown(data, callback) {
    //** OBJ **
    // data = { serviceDate, consumerId }
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
        '/getServiceLocationsForCaseNoteDropDown/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "serviceDate":"' +
        data.serviceDate +
        '", "consumerId":"' +
        data.consumerId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getServiceLocationsForCaseNoteDropDownResult;
        callback(res);
      },
    });
  }
  function caseNoteOverlapCheck(data, callback) {
    // data = {consumerId, startTime, endTime, serviceDate, caseManagerId, noteId, groupNoteId}
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
        '/caseNoteOverlapCheck/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "consumerId":"' +
        data.consumerId +
        '", "startTime":"' +
        data.startTime +
        '", "endTime":"' +
        data.endTime +
        '", "serviceDate":"' +
        data.serviceDate +
        '", "caseManagerId":"' +
        data.caseManagerId +
        '", "noteId":"' +
        data.noteId +
        '", "groupNoteId":"' +
        data.groupNoteId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.parse(response.caseNoteOverlapCheckResult);
        callback(res);
      },
    });
  }

  // SAVE, UPDATE, DELETE
    function saveSingleCaseNote(data, callback) {
    // saveCaseNote
    data = {
      token: $.session.Token,
      noteId: data.noteId,
      caseManagerId: data.caseManagerId,
      consumerId: data.consumerId,
      serviceOrBillingCodeId: data.serviceOrBillingCodeId,
      locationCode: data.locationCode,
      serviceCode: data.serviceCode,
      needCode: data.needCode,
      serviceDate: data.serviceDate,
      startTime: data.startTime,
      endTime: data.endTime,
      vendorId: data.vendorId,
      contactCode: data.contactCode,
      serviceLocationCode: data.serviceLocationCode,
      caseNote: data.caseNote,
      reviewRequired: data.reviewRequired,
      confidential: data.confidential,
      corrected: data.corrected,
      casenotemileage: data.casenotemileage,
      casenotetraveltime: data.casenotetraveltime,
      documentationTime: data.documentationTime,
      outcomeServiceMonitoring: data.serviceMonitoring
    };
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/saveCaseNote/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        callback(response.saveCaseNoteResult);
      },
    });
  }
  function saveGroupCaseNote(data, callback) {
    // saveGroupCaseNote
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
        '/saveGroupCaseNote/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "noteId":"' +
        data.noteId +
        '","groupNoteId":"' +
        data.groupNoteId +
        '","caseManagerId":"' +
        data.caseManagerId +
        '", "consumerId":"' +
        data.consumerId +
        '", "serviceOrBillingCodeId":"' +
        data.serviceOrBillingCodeId +
        '", "locationCode":"' +
        data.locationCode +
        '", "serviceCode":"' +
        data.serviceCode +
        '", "needCode":"' +
        data.needCode +
        '", "serviceDate":"' +
        data.serviceDate +
        '", "startTime":"' +
        data.startTime +
        '", "endTime":"' +
        data.endTime +
        '", "vendorId":"' +
        data.vendorId +
        '", "contactCode":"' +
        data.contactCode +
        '", "serviceLocationCode":"' +
        data.serviceLocationCode +
        '", "caseNote":"' +
        data.caseNote +
        '", "reviewRequired":"' +
        data.reviewRequired +
        '", "confidential":"' +
        data.confidential +
        '", "consumerGroupCount":"' +
        data.consumerGroupCount +
        '", "casenotemileage":"' +
        data.casenotemileage +
        '", "casenotetraveltime":"' +
        data.casenotetraveltime +
        '", "documentationTime":"' +
        data.documentationTime +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function saveAdditionalGroupCaseNote(data, callback) {
    // saveAdditionalGroupCaseNote
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
        '/saveAdditionalGroupCaseNote/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "noteId":"' +
        data.noteId +
        '","groupNoteId":"' +
        data.groupNoteId +
        '","caseManagerId":"' +
        data.caseManagerId +
        '", "consumerId":"' +
        data.consumerId +
        '", "serviceOrBillingCodeId":"' +
        data.serviceOrBillingCodeId +
        '", "locationCode":"' +
        data.locationCode +
        '", "serviceCode":"' +
        data.serviceCode +
        '", "needCode":"' +
        data.needCode +
        '", "serviceDate":"' +
        data.serviceDate +
        '", "startTime":"' +
        data.startTime +
        '", "endTime":"' +
        data.endTime +
        '", "vendorId":"' +
        data.vendorId +
        '", "contactCode":"' +
        data.contactCode +
        '", "serviceLocationCode":"' +
        data.serviceLocationCode +
        '", "reviewRequired":"' +
        data.reviewRequired +
        '", "confidential":"' +
        data.confidential +
        '", "caseNote":"' +
        data.caseNote +
        '", "casenotemileage":"' +
        data.casenotemileage +
        '", "casenotetraveltime":"' +
        data.casenotetraveltime +
        '", "documentationTime":"' +
        data.documentationTime +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback(res);
      },
    });
  }
  function updateGroupNoteValues(data, callback) {
    // updateGroupNoteValues
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
        '/updateGroupNoteValues/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "groupNoteId":"' +
        data.groupNoteId +
        '", "noteId":"' +
        data.noteId +
        '", "serviceOrBillingCodeId":"' +
        data.serviceOrBillingCodeId +
        '","serviceDate":"' +
        data.serviceDate +
        '", "startTime":"' +
        data.startTime +
        '", "endTime":"' +
        data.endTime +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback(res);
      },
    });
  }
  async function deleteExistingCaseNote(noteId) {
    try {
      const data = {
        token: $.session.Token,
        noteId: noteId,
      };
      const res = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deleteExistingCaseNote/',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        // success: function (response, status, xhr) {
        // 	var res = JSON.stringify(response);
        // },
        // error: function (xhr, status, error) {
        // 	//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        // },
      });
      return res.deleteExistingCaseNoteResult;
    } catch (error) {
      console.log(error);
    }
  }

  // ATTACHMENTS
  function addCaseNoteAttachment(caseNoteId, desc, attachmentType, buf, cb) {
    // let abString = btoa(String.fromCharCode.apply(null, new Uint8Array(buf)))
    var binary = '';
    var bytes = new Uint8Array(buf);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let abString = window.btoa(binary);
    data = {
      token: $.session.Token,
      caseNoteId: caseNoteId,
      description: desc,
      attachmentType: attachmentType,
      attachment: abString,
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
        '/addCaseNoteAttachment/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.deleteCaseNoteAttachmentResult;
        if (cb) cb(res);
      },
      error: function (xhr, status, error) {},
    });
  }
  function deleteCaseNoteAttachment(caseNoteId, attachmentId) {
    data = {
      token: $.session.Token,
      caseNoteId: caseNoteId,
      attachmentId: attachmentId,
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
        '/deleteCaseNoteAttachment/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.deleteCaseNoteAttachmentResult;
      },
      error: function (xhr, status, error) {},
    });
  }
  function viewCaseNoteAttachment(attachmentId) {
    data = {
      attachmentId: attachmentId,
    };
    var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/viewCaseNoteAttachment/`;
    var successFunction = function (resp) {
      var res = JSON.stringify(response);
    };

    var form = document.createElement('form');
    form.setAttribute('action', action);
    form.setAttribute('method', 'POST');
    form.setAttribute('target', '_blank');
    form.setAttribute('enctype', 'application/json');
    form.setAttribute('success', successFunction);
    var tokenInput = document.createElement('input');
    tokenInput.setAttribute('name', 'token');
    tokenInput.setAttribute('value', $.session.Token);
    tokenInput.id = 'token';
    var attachmentInput = document.createElement('input');
    attachmentInput.setAttribute('name', 'attachmentId');
    attachmentInput.setAttribute('value', attachmentId);
    attachmentInput.id = 'attachmentId';

    form.appendChild(tokenInput);
    form.appendChild(attachmentInput);
    form.style.position = 'absolute';
    form.style.opacity = '0';
    document.body.appendChild(form);

    form.submit();
  }

  // PHRASES
  function getCustomPhrases(showAll, cb) {
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
        '/getCustomPhrases/',
      data: '{"token":"' + $.session.Token + '", "showAll":"' + showAll + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getCustomPhrasesResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function insertCustomPhrases(shortcut, phrase, makePublic, cb) {
    data = {
      token: $.session.Token,
      shortcut: shortcut,
      phrase: phrase,
      makePublic: makePublic,
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
        '/insertCustomPhrase/',
      //data: '{"token":"' + $.session.Token + '", "shortcut":"' + shortcut + '", "phrase":"' + phrase + '", "makePublic":"' + makePublic + '"}',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getCustomPhraseResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getConsumersForCNFilter(callback) {
    data = {
      token: $.session.Token,
      caseLoadOnly: $.session.CaseNotesCaseloadRestriction ? 'Y' : 'N',
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
        '/getConsumersForCNFilter/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getConsumersForCNFilterResult;
        callback(res);
      },
      error: function (xhr, status, error) {},
    });
  }

  // REPORTS
  function generateCNDetailReport(filterValues, callback) {
    //data = {
    //    token: $.session.Token,
    //    userId: $.session.UserId,
    //    billerId: filterValues.billerId,
    //    consumerId: filterValues.consumer,
    //    consumerName: filterValues.consumerName,
    //    serviceStartDate: filterValues.serviceDateStart,
    //    serviceEndDate: filterValues.serviceDateEnd,
    //    enteredDateStart: filterValues.enteredDateStart,
    //    enteredDateEnd: filterValues.enteredDateEnd,
    //    billingCode: filterValues.billingCode,
    //    location: filterValues.location,
    //    service: filterValues.service,
    //    need: filterValues.need,
    //    contact: filterValues.contact,
    //    applicationName: $.session.applicationName
    //}
    if (filterValues.billCodeText == null || filterValues.billCodeText == undefined) {
      filterValues.billCodeText = 'All';
    }
    data = {
      token: $.session.Token,
      userId: $.session.UserId,
      billerId: filterValues.billerId,
      consumerId: filterValues.consumer,
      consumerName: filterValues.consumerName,
      serviceStartDate: filterValues.serviceDateStart,
      serviceEndDate: filterValues.serviceDateEnd,
      location: filterValues.location,
      originallyEnteredStart: filterValues.enteredDateStart,
      originallyEnteredEnd: filterValues.enteredDateEnd,
      billingCode: filterValues.billCodeText,
      service: filterValues.service,
      need: filterValues.need,
      contact: filterValues.contact,
      applicationName: $.session.applicationName,
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
        '/generateCNDetailReport/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.generateCNDetailReportResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function generateCNTimeAnalysisReport(filterValues, callback) {
    //string token, string userId, string billerId, string consumerId, string billingCode, string applicationName
    if (filterValues.billCodeText == null || filterValues.billCodeText == undefined) {
      filterValues.billCodeText = 'All';
    }
    data = {
      token: $.session.Token,
      userId: $.session.UserId,
      billerId: filterValues.billerId,
      consumerId: filterValues.consumer,
      consumerName: filterValues.consumerName,
      billingCode: filterValues.billCodeText,
      serviceStartDate: filterValues.serviceDateStart,
      serviceEndDate: filterValues.serviceDateEnd,
      applicationName: $.session.applicationName,
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
        '/generateCNTimeAnalysisReport/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.generateCNTimeAnalysisReportResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function checkIfCNReportExists(res, callback) {
    data = {
      token: $.session.Token,
      reportScheduleId: res[0].reportScheduleId,
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
        '/checkIfCNReportExists/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.checkIfCNReportExistsResult;
        callback(res, data.reportScheduleId);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function viewCaseNoteReport(reportScheduleId) {
    data = {
      reportScheduleId: reportScheduleId,
    };
    var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/viewCaseNoteReport/`;
    var successFunction = function (resp) {
      var res = JSON.stringify(response);
    };

    var form = document.createElement('form');
    form.setAttribute('action', action);
    form.setAttribute('method', 'POST');
    form.setAttribute('target', '_blank');
    form.setAttribute('enctype', 'application/json');
    form.setAttribute('success', successFunction);
    var tokenInput = document.createElement('input');
    tokenInput.setAttribute('name', 'token');
    tokenInput.setAttribute('value', $.session.Token);
    tokenInput.id = 'token';
    var attachmentInput = document.createElement('input');
    attachmentInput.setAttribute('name', 'reportScheduleId');
    attachmentInput.setAttribute('value', reportScheduleId);
    attachmentInput.id = 'reportScheduleId';

    form.appendChild(tokenInput);
    form.appendChild(attachmentInput);
    form.style.position = 'absolute';
    form.style.opacity = '0';
    document.body.appendChild(form);

    form.submit();
  }

  // OTHER
  function getCNPopulateFilterDropdowns(serviceCodeId) {
    // Pass % service code on initial load and when service code/bill code == ALL
    data = {
      token: $.session.Token,
      serviceCodeId: serviceCodeId,
    };
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/getCNPopulateFilterDropdowns/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }
  function getSSAServiceOptionsDropdown(consumerId, serviceDate, callback) {
    if (consumerId == '' || consumerId == undefined) {
      consumerId = $.session.caseNoteConsumerId;
    }

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
        '/getSSAServiceOptionsDropdown/',
      data:
        '{"token":"' + $.session.Token + '", "serviceDate":"' + serviceDate + '", "consumerId":"' + consumerId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getSSAServiceOptionsDropdownResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getCaseLoadRestriction(callback) {
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
        '/getCaseLoadRestriction/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.parse(response.getCaseLoadRestrictionResult);
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getSSABillCodesFromService(serviceName, servicePersonApproved, callback) {
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
        '/getSSABillCodesFromService/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "serviceName":"' +
        serviceName +
        '", "personApproved":"' +
        servicePersonApproved +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getSSABillCodesFromServiceResult;
        callback(res, servicePersonApproved);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  return {
    getConsumersThatCanHaveMileage,
    getBillersListForDropDown,
    getFilteredCaseNotesList,
    getConsumerSpecificVendors,
    getCaseNoteEdit,
    getReviewRequiredForCaseManager,
    getDropdownData,
    getGroupNoteId,
    getServiceLocationsForCaseNoteDropDown,
    getCaseLoadRestriction,
    // saving & updating
    caseNoteOverlapCheck,
    saveSingleCaseNote,
    saveGroupCaseNote,
    saveAdditionalGroupCaseNote,
    updateGroupNoteValues,
    deleteExistingCaseNote,
    getCustomPhrases,
    insertCustomPhrases,
    deleteCaseNoteAttachment,
    addCaseNoteAttachment,
    viewCaseNoteAttachment,
    getCaseNoteAttachmentsList,
    getConsumersForCNFilter,
    getCNPopulateFilterDropdowns,
    getSSAServiceOptionsDropdown,
    getSSABillCodesFromService,
    generateCNDetailReport,
    generateCNTimeAnalysisReport,
    checkIfCNReportExists,
    viewCaseNoteReport,
  };
})();
