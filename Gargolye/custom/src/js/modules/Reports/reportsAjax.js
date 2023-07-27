var generateReportsAjax = (function () {
    function generateReport(reportType, reportData, callback) {
        data = {
          token: $.session.Token,
          reportType, 
          reportData
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
            '/generateReport/',
          data: JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (response, status, xhr) {
            var res = response.generateReportResult;
            callback(res);
          },
          error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          },
        });
      }

    function checkIfReportExists(res, callback) {
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
            '/checkIfReportExists/',
          data: JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (response, status, xhr) {
            var res = response.checkIfReportExistsResult;
            //callback(res, data.reportScheduleId);
          },
          error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          },
        });
      }

      function viewReport(reportScheduleId) {
        data = {
          reportScheduleId: reportScheduleId,
        };
        var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/viewReport/`;
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

    return {
        generateReport,
        checkIfReportExists,
        viewReport
    };
  })();
  