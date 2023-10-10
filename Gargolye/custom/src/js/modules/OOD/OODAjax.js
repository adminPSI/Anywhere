var OODAjax = (function () {
  // OOD Main/Landing Page
      async function getOODEntriesAsync(consumerIds, serviceStartDate, serviceEndDate, userId, serviceCode, referenceNumber) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getOODEntries/',
        data:
          '{"token":"' +
          $.session.Token +
          '", "consumerIds":"' +
          consumerIds +
          '", "serviceStartDate":"' +
          serviceStartDate +
          '", "serviceEndDate":"' +
          serviceEndDate +
          '", "userId":"' +
          userId +
          '", "serviceCode":"' +
          serviceCode +
          '", "referenceNumber":"' +
          referenceNumber +
          '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  // OOD Main/Landing Page
  async function getActiveEmployeesAsync() {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getActiveEmployees/',
        data: JSON.stringify({
          token: $.session.Token,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  // Form 4 -- Monthly Placement
  async function getConsumerEmployersAsync(consumerId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getConsumerEmployers/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerId: consumerId,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  
  // Employers Page
  async function getActiveEmployersAsync() {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getActiveEmployers/',
        data: JSON.stringify({
          token: $.session.Token,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  // Employers Page
  async function deleteEmployerAsync(employerId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deleteEmployer/',
        data:
          '{"token":"' +
          $.session.Token +
          '", "employerId":"' +
          employerId +
          '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  // Employers Page
  async function updateEmployerAsync(
    employerId, 
    employerName, 
    address1, 
    address2, 
    city, 
    state,
    zipcode
  ) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updateEmployer/',
        data: JSON.stringify({
          token: $.session.Token,
          employerId, 
          employerName, 
          address1, 
          address2, 
          city, 
          state,
          zipcode,
          userId: $.session.UserId
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  // Employers Page
  async function insertEmployerAsync(
    employerName, 
    address1, 
    address2, 
    city, 
    state,
    zipcode
  ) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertEmployer/',
        data: JSON.stringify({
          token: $.session.Token,
          employerName, 
          address1, 
          address2, 
          city, 
          state,
          zipcode,
          userId: $.session.UserId
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  // Employers Page
  function getEmployer(employerId, callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getEmployerJSON/',
      data: '{"token":"' + $.session.Token + '", "employerId":"' + employerId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = response.getEmployerJSONResult;
        callback(res);
      },
      error: function(xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  // OOD Main/Landing Page
  async function getActiveServiceCodesAsync(serviceCodeType) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getActiveServiceCodes/',
        data: JSON.stringify({
          token: $.session.Token,
          serviceCodeType: serviceCodeType,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  
  async function getConsumerReferenceNumbersAsync(consumerIds, startDate, endDate, serviceType) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getConsumerReferenceNumbers/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerIds: consumerIds,
          startDate: startDate,
          endDate: endDate,
          serviceType: serviceType,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  
  // OOD Main/Landing Page
  async function getConsumerServiceCodesAsync(consumerId, serviceDate) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getConsumerServiceCodes/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerId: consumerId,
          serviceDate: serviceDate,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  
  // Form 4 -- Monthly Placement
  async function getContactTypesAsync() {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getContactTypes/',
        data: JSON.stringify({
          token: $.session.Token,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  
  // Form 4 -- Monthly Placement
  async function getOutcomesAsync() {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getOutcomes/',
        data: JSON.stringify({
          token: $.session.Token,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  //  Form 8 Community Based Assessment Form -- Contact Methods data for DDL
   async function getContactMethodsAsync() {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getContactMethods/',
        data: JSON.stringify({
          token: $.session.Token,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

   //  Form 8 Community Based Assessment Form -- Indicators data for DDLs
   async function getIndicatorsAsync() {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getIndicators/',
        data: JSON.stringify({
          token: $.session.Token,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

   //  Form 8 Community Based Assessment Form -- Positions data for DDLs
   async function getPositionsAsync(consumerId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getOODPositions/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerId: consumerId,
          
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }


  // Form 4 -- Monthly Placement
  function getForm4MonthlyPlacementEditData(caseNoteId, callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getForm4MonthlyPlacementEditDataJSON/',
      data: '{"token":"' + $.session.Token + '", "caseNoteId":"' + caseNoteId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = response.getForm4MonthlyPlacementEditDataJSONResult;
        callback(res);
      },
      error: function(xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  
  // Form 4 -- Monthly Placement
  function updateForm4MonthlyPlacementEditData(data, callback) {
      data = {
        token: $.session.Token, 
        consumerId: data.consumerId, 
        caseNoteId: data.caseNoteId,
        serviceDate: data.serviceDate,
        startTime: data.startTime,
        endTime: data.endTime,
        SAMLevel: data.SAMLevel,
        employer: data.employer,
        contactType: data.contactType,
        jobSeekerPresent: data.jobSeekerPresent,
        outcome: data.outcome,
        TSCNotified: data.TSCNotified,
        bilingualSupplement: data.bilingualSupplement,
        notes: data.notes,
        userId: data.userId,
        application: data.application, 
        interview: data.interview,
         }
    return $.ajax({
    type: 'POST',
    url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateForm4MonthlyPlacementEditData/',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(response, status, xhr) {
    callback(response.updateForm4MonthlyPlacementEditDataResult);
    },
    });
  }
  
  // Form 4 -- Monthly Placement
  function insertForm4MonthlyPlacementEditData(data, callback) {
    data = {
      token: $.session.Token, 
      consumerId: data.consumerId, 
      caseNoteId: data.caseNoteId,
      serviceDate: data.serviceDate,
      startTime: data.startTime,
      endTime: data.endTime,
      SAMLevel: data.SAMLevel,
      employer: data.employer,
      contactType: data.contactType,
      jobSeekerPresent: data.jobSeekerPresent,
      outcome: data.outcome,
      TSCNotified: data.TSCNotified,
      bilingualSupplement: data.bilingualSupplement,
      notes: data.notes,
      caseManagerId: data.caseManagerId,
      userId: data.userId,
      serviceId: data.serviceId,
      referenceNumber: data.referenceNumber,
      application: data.application, 
      interview: data.interview,
  
       }
  return $.ajax({
  type: 'POST',
  url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertForm4MonthlyPlacementEditData/',
  data: JSON.stringify(data),
  contentType: 'application/json; charset=utf-8',
  dataType: 'json',
  success: function(response, status, xhr) {
  callback(response.insertForm4MonthlyPlacementEditDataResult);
  },
  });
  }
  
  // Both Forms (Form 4 and Form 8) -- OOD Form Entry
  // TODO JOE: LOOK into this for Form 10 
  async function deleteOODFormEntryAsync(caseNoteId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deleteOODFormEntry/',
        data:
          '{"token":"' +
          $.session.Token +
          '", "caseNoteId":"' +
          caseNoteId +
          '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  
  
  // Form 4 -- Monthly Summary
  function getForm4MonthlySummary(emReviewId, callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getForm4MonthlySummaryJSON/',
      data: '{"token":"' + $.session.Token + '", "emReviewId":"' + emReviewId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = response.getForm4MonthlySummaryJSONResult[0];
        callback(res);
      },
      error: function(xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  
  // Form 4 -- Monthly Summary
  function updateForm4MonthlySummary(data, callback) {
      data = {
        token: $.session.Token, 
        consumerId: data.consumerId, 
        emReviewId: data.emReviewId,
        emReviewDate: data.emReviewDate,
        emReferenceNumber: data.emReferenceNumber,
        emNextScheduledReview: data.emNextScheduledReview,
        emEmploymentGoal: data.emEmploymentGoal,
        emReferralQuestions: data.emReferralQuestions,   //-- REMOVED FROM FORM ON 4/7/22
        emIndivInputonSearch: data.emIndivInputonSearch,
        emPotentialIssueswithProgress: data.emPotentialIssueswithProgress,
        emPlanGoalsNextMonth: data.emPlanGoalsNextMonth,   //-- REMOVED FROM FORM ON 4/7/22
        emNumberofConsumerContacts: data.emNumberofConsumerContacts,  //-- REMOVED FROM FORM ON 4/7/22
        emNumberEmployerContactsbyConsumer: data.emNumberEmployerContactsbyConsumer,  //-- REMOVED FROM FORM ON 4/7/22
        emNumberEmployerContactsbyStaff: data.emNumberEmployerContactsbyStaff,  //-- REMOVED FROM FORM ON 4/7/22
        emNumberMonthsJobDevelopment: data.emNumberMonthsJobDevelopment,   //-- REMOVED FROM FORM ON 4/7/22
        userId: data.userId
         }
    return $.ajax({
    type: 'POST',
    url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateForm4MonthlySummary/',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(response, status, xhr) {
    callback(response.updateForm4MonthlySummaryResult);
    },
    });
  }
  
  // Form 4 -- Monthly Summary
  function insertForm4MonthlySummary(data, callback) {
    data = {
      token: $.session.Token, 
      consumerId: data.consumerId, 
      emReviewDate: data.emReviewDate,
      emReferenceNumber: data.emReferenceNumber,
      emNextScheduledReview: data.emNextScheduledReview,
      emEmploymentGoal: data.emEmploymentGoal,
      emReferralQuestions: data.emReferralQuestions,   //-- REMOVED FROM FORM ON 4/7/22
      emIndivInputonSearch: data.emIndivInputonSearch,
      emPotentialIssueswithProgress: data.emPotentialIssueswithProgress,
      emPlanGoalsNextMonth: data.emPlanGoalsNextMonth,   //-- REMOVED FROM FORM ON 4/7/22
      emNumberofConsumerContacts: data.emNumberofConsumerContacts,  //-- REMOVED FROM FORM ON 4/7/22
      emNumberEmployerContactsbyConsumer: data.emNumberEmployerContactsbyConsumer,  //-- REMOVED FROM FORM ON 4/7/22
      emNumberEmployerContactsbyStaff: data.emNumberEmployerContactsbyStaff,  //-- REMOVED FROM FORM ON 4/7/22
      emNumberMonthsJobDevelopment: data.emNumberMonthsJobDevelopment,  //-- REMOVED FROM FORM ON 4/7/22
      userId: data.userId,
      serviceId: data.serviceId
       }
  return $.ajax({
  type: 'POST',
  url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertForm4MonthlySummary/',
  data: JSON.stringify(data),
  contentType: 'application/json; charset=utf-8',
  dataType: 'json',
  success: function(response, status, xhr) {
  callback(response.insertForm4MonthlySummaryResult);
  },
  });
  }
  
  // Both Forms (Form 4 and Form 8) -- Monthly Entry
  async function deleteFormMonthlySummaryAsync(emReviewId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deleteFormMonthlySummary/',
        data:
          '{"token":"' +
          $.session.Token +
          '", "emReviewId":"' +
          emReviewId +
          '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  
    // Form 8 -- Form8CommunityBasedAssessment
    function getForm8CommunityBasedAssessment(caseNoteId, callback) {
      $.ajax({
        type: 'POST',
        url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getForm8CommunityBasedAssessment/',
        data: '{"token":"' + $.session.Token + '", "caseNoteId":"' + caseNoteId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(response, status, xhr) {
          var res = response.getForm8CommunityBasedAssessmentResult;
          callback(res);
        },
        error: function(xhr, status, error) {
          //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
      });
    }
    
    // Form 8 -- Form8CommunityBasedAssessment
    function updateForm8CommunityBasedAssessment(data, callback) {
        data = {
          token: $.session.Token, 
          consumerId: data.consumerId, 
          caseNoteId: data.caseNoteId,
          serviceDate: data.serviceDate,
          startTime: data.startTime,
          endTime: data.endTime,
          SAMLevel: data.SAMLevel,
          position: data.position,
          contactMethod: data.contactMethod,
          behavioralIndicators: data.behavioralIndicators,
          jobTaskQualityIndicators: data.jobTaskQualityIndicators,
          jobTaskQuantityIndicators: data.jobTaskQuantityIndicators,
          narrative: data.narrative,
          interventions: data.interventions,
           }
      return $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateForm8CommunityBasedAssessment/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
      callback(response.updateForm8CommunityBasedAssessmentResult);
      },
      });
    }
    
    // Form 8 -- Form8CommunityBasedAssessment
    function insertForm8CommunityBasedAssessment(data, callback) {
      data = {
        token: $.session.Token, 
          consumerId: data.consumerId, 
          caseNoteId: data.caseNoteId,
          serviceDate: data.serviceDate,
          startTime: data.startTime,
          endTime: data.endTime,
          SAMLevel: data.SAMLevel,
          position: data.position,
          contactMethod: data.contactMethod,
          behavioralIndicators: data.behavioralIndicators,
          jobTaskQualityIndicators: data.jobTaskQualityIndicators,
          jobTaskQuantityIndicators: data.jobTaskQuantityIndicators,
          narrative: data.narrative,
          interventions: data.interventions,
          userId: data.userId,
          serviceId: data.serviceId,
          referenceNumber: data.referenceNumber,
          caseManagerId: data.caseManagerId,
    
         }
    return $.ajax({
    type: 'POST',
    url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertForm8CommunityBasedAssessment/',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(response, status, xhr) {
    callback(response.insertForm8CommunityBasedAssessmentResult);
    },
    });
    }
  
      // Form 8 -- Monthly Summary
  function getForm8MonthlySummary(emReviewId, callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getForm8MonthlySummary/',
      data: '{"token":"' + $.session.Token + '", "emReviewId":"' + emReviewId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = response.getForm8MonthlySummaryResult[0];
        callback(res);
      },
      error: function(xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  
  // Form 8 -- Monthly Summary
  function updateForm8MonthlySummary(data, callback) {
      data = {
        token: $.session.Token, 
        consumerId: data.consumerId, 
        emReviewId: data.emReviewId,
        emReviewDate: data.emReviewDate,
        emReferenceNumber: data.emReferenceNumber,
        emNextScheduledReview: data.emNextScheduledReview,
        emSummaryIndivSelfAssessment: data.emSummaryIndivSelfAssessment,
        emSummaryIndivEmployerAssessment: data.emSummaryIndivEmployerAssessment,
        emSummaryIndivProviderAssessment: data.emSummaryIndivProviderAssessment, 
        emSupportandTransition: data.emSupportandTransition,
        emReviewVTS: data.emReviewVTS,
        userId: data.userId, 
         }
    return $.ajax({
    type: 'POST',
    url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateForm8MonthlySummary/',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(response, status, xhr) {
    callback(response.updateForm8MonthlySummaryResult);
    },
    });
  }
  
  // Form 8 -- Monthly Summary
  function insertForm8MonthlySummary(data, callback) {
    data = {
      token: $.session.Token, 
      consumerId: data.consumerId, 
      emReviewDate: data.emReviewDate,
      emReferenceNumber: data.emReferenceNumber,
      emNextScheduledReview: data.emNextScheduledReview,
      emSummaryIndivSelfAssessment: data.emSummaryIndivSelfAssessment,
      emSummaryIndivEmployerAssessment: data.emSummaryIndivEmployerAssessment,
      emSummaryIndivProviderAssessment: data.emSummaryIndivProviderAssessment,
      emSupportandTransition: data.emSupportandTransition,
      emReviewVTS: data.emReviewVTS,
      userId: data.userId,
      serviceId: data.serviceId     
       }
  return $.ajax({
  type: 'POST',
  url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertForm8MonthlySummary/',
  data: JSON.stringify(data),
  contentType: 'application/json; charset=utf-8',
  dataType: 'json',
  success: function(response, status, xhr) {
  callback(response.insertForm8MonthlySummaryResult);
  },
  });
  }

   // Form 10 -- Transportation
   function getForm10TransportationData(OODTransportationId, callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getForm10TransportationData/',
      data: '{"token":"' + $.session.Token + '", "OODTransportationId":"' + OODTransportationId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = response.getForm10TransportationDataResult;
        callback(res);
      },
      error: function(xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  
  // Form 10 -- Transportation
  function updateForm10TransportationData(data, callback) {
      data = {
        token: $.session.Token, 
        consumerId: data.consumerId, 
        OODTransportationId: data.OODTransportationId,
        serviceDate: data.serviceDate,
        startTime: data.startTime,
        endTime: data.endTime,  
        numberInVehicle: data.numberInVehicle,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        userId: data.userId,        
         }
    return $.ajax({
    type: 'POST',
    url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateForm10TransportationData/',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(response, status, xhr) {
    callback(response.updateForm10TransportationDataResult);
    },
    });
  }
  
  // Form 10 -- Transportation
  function insertForm10TransportationData(data, callback) {
    data = {
      token: $.session.Token, 
      consumerId: data.consumerId, 
      serviceDate: data.serviceDate,
      startTime: data.startTime,
      endTime: data.endTime,
      numberInVehicle: data.numberInVehicle,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      userId: data.userId,
      referenceNumber: data.referenceNumber,
  
       }
  return $.ajax({
  type: 'POST',
  url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertForm10TransportationData/',
  data: JSON.stringify(data),
  contentType: 'application/json; charset=utf-8',
  dataType: 'json',
  success: function(response, status, xhr) {
  callback(response.insertForm10TransportationDataResult);
  },
  });
  }


  return {       
   
      getOODEntriesAsync,
      getActiveEmployeesAsync,
      getConsumerEmployersAsync,
      getActiveEmployersAsync,
      deleteEmployerAsync,
      updateEmployerAsync,
      insertEmployerAsync,
      getEmployer,
      getActiveServiceCodesAsync,
      getConsumerReferenceNumbersAsync,
      getConsumerServiceCodesAsync,
      getContactTypesAsync,
      getOutcomesAsync,
      getContactMethodsAsync,
      getIndicatorsAsync,
      getPositionsAsync,
      getForm4MonthlyPlacementEditData,
      updateForm4MonthlyPlacementEditData,
      insertForm4MonthlyPlacementEditData,
      deleteOODFormEntryAsync,
      getForm4MonthlySummary,
      updateForm4MonthlySummary,
      insertForm4MonthlySummary,
      deleteFormMonthlySummaryAsync,
      getForm8CommunityBasedAssessment,
      updateForm8CommunityBasedAssessment,
      insertForm8CommunityBasedAssessment,
      getForm8MonthlySummary,
      updateForm8MonthlySummary,
      insertForm8MonthlySummary,
      getForm10TransportationData,
      insertForm10TransportationData,
      updateForm10TransportationData,
      

  };
  }) ();
  