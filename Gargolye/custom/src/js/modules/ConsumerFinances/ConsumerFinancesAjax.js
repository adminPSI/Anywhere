var ConsumerFinancesAjax = (function () {
  // OOD Main/Landing Page
  async function getAccountTransectionEntriesAsync(
    consumerIds,
    activityStartDate,
    activityEndDate,
    accountName,
    payee,
    category,
    minamount,
    maxamount,
    checkNo,
    balance,
    enteredBy,
    isattachment,
    transectionType,
    accountPermission,
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
          '/getAccountTransectionEntries/',
        data:
          '{"token":"' +
          $.session.Token +
          '", "consumerIds":"' +
          consumerIds +
          '", "activityStartDate":"' +
          activityStartDate +
          '", "activityEndDate":"' +
          activityEndDate +
          '", "accountName":"' +
          accountName +
          '", "payee":"' +
          payee +
          '", "category":"' +
          category +
          '", "minamount":"' +
          minamount +
          '", "maxamount":"' +
          maxamount +
          '", "checkNo":"' +
          checkNo +
          '", "balance":"' +
          balance +
          '", "enteredBy":"' +
          enteredBy +
          '", "isattachment":"' +
          isattachment +
          '", "transectionType":"' +
          transectionType +
          '", "accountPermission":"' +
          accountPermission +
          '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getActiveAccountAsync(ConsumersId, accountPermission) {
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
          '/getActiveAccount/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerId: ConsumersId,
          accountPermission: accountPermission,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getPayeesAsync(ConsumersId) {
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
          '/getPayees/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerId: ConsumersId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getCategoriesAsync(CategoryID) {
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
          '/getCatogories/',
        data: JSON.stringify({
          token: $.session.Token,
          categoryID: CategoryID,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getSubCategoriesAsync(Category) {
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
          '/getSubCatogories/',
        data: JSON.stringify({
          token: $.session.Token,
          category: Category,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getCategoriesSubCategoriesByPayeeAsync(CategoryID) {
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
          '/getCategoriesSubCategoriesByPayee/',
        data: JSON.stringify({
          token: $.session.Token,
          categoryID: CategoryID,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function insertPayeeAsync(payeeName, payeeaddress1, payeeaddress2, payeecity, payeestate, payeezipcode) {
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
          '/insertPayee/',
        data: JSON.stringify({
          token: $.session.Token,
          payeeName: payeeName,
          address1: payeeaddress1,
          address2: payeeaddress2,
          city: payeecity,
          state: payeestate,
          zipcode: payeezipcode,
          userId: $.session.UserId,
          consumerId: $.session.consumerId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function insertAccountAsync(
    date,
    amount,
    amountType,
    AccountID,
    payee,
    CategoryID,
    subCategory,
    checkNo,
    description,
    attachmentID,
    attachmentDesc,
    receipt,
    BtnName,
    regId,
    splitAmount,
    categoryID,
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
          '/insertAccount/',
        data: JSON.stringify({
          token: $.session.Token,
          date: date,
          amount: amount,
          amountType: amountType,
          account: AccountID,
          payee: payee,
          category: CategoryID,
          subCategory: subCategory,
          checkNo: checkNo,
          description: description,
          attachmentId: attachmentID,
          attachmentDesc: attachmentDesc,
          receipt: receipt,
          userId: $.session.UserId,
          eventType: BtnName,
          regId: regId,
          splitAmount: splitAmount,
          categoryID: categoryID,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getAccountEntriesByIDAsync(registerId) {
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
          '/getAccountEntriesById/',
        data: '{"token":"' + $.session.Token + '", "registerId":"' + registerId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function deleteConsumerFinanceAccountAsync(registerId) {
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
          '/deleteConsumerFinanceAccount/',
        data: '{"token":"' + $.session.Token + '", "registerId":"' + registerId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

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
          '/getActiveUsedBy/',
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

  async function addCFAttachment(retrieveData) {
    try {
      var binary = '';
      var bytes = new Uint8Array(retrieveData.attachment);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let abString = window.btoa(binary);
      retrieveData.attachment = abString;
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/addCFAttachment/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.addCFAttachmentResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  function deleteCFAttachment(attachmentId) {
    data = {
      token: $.session.Token,
      attachmentId: attachmentId,
    };
    try {
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
          '/deleteCFAttachment/',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response, status, xhr) {
          var res = response.deletePlanAttachmentResult;
        },
      });
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function getCFAttachmentsList(retrieveData) {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getCFAttachmentsList/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getCFAttachmentsListResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function getConsumerNameByID(retrieveData) {
    //token, consumerId
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
        '/getConsumerNameByID/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }

  function viewCFAttachment(attachmentId, section) {
    data = {
      attachmentId: attachmentId,
    };
    var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/viewCFAttachment/`;
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
    var sectionInput = document.createElement('input');
    sectionInput.setAttribute('name', 'section');
    sectionInput.setAttribute('value', section);
    sectionInput.id = 'section';

    form.appendChild(tokenInput);
    form.appendChild(attachmentInput);
    form.appendChild(sectionInput);
    form.style.position = 'absolute';
    form.style.opacity = '0';
    document.body.appendChild(form);

    form.submit();
    form.remove();
  }

  async function getCategoriesSubCategoriesAsync(CategoryID) {
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
          '/getCategoriesSubCategories/',
        data: JSON.stringify({
          token: $.session.Token,
          categoryID: CategoryID,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getEditAccountInfoByIdAsync(accountId) {
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
          '/getEditAccountInfoById/',
        data: '{"token":"' + $.session.Token + '", "accountId":"' + accountId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getAccountClassAsync() {
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
          '/getAccountClass/',
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

  async function insertEditRegisterAccountAsync(
    selectedConsumersId,
    accountId,
    name,
    number,
    type,
    status,
    classofAccount,
    dateOpened,
    dateClosed,
    openingBalance,
    description,
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
          '/insertEditRegisterAccount/',
        data: JSON.stringify({
          token: $.session.Token,
          selectedConsumersId: selectedConsumersId,
          accountId: accountId,
          name: name,
          number: number,
          type: type,
          status: status,
          classofAccount: classofAccount,
          dateOpened: dateOpened,
          dateClosed: dateClosed,
          openingBalance: openingBalance,
          description: description,
          userId: $.session.UserId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getEditAccountAsync(ConsumersId, accountPermission) {
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
          '/getEditAccount/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerId: ConsumersId,
          accountPermission: accountPermission,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getSplitRegisterAccountEntriesByIDAsync(registerId) {
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
          '/getSplitRegisterAccountEntriesByID/',
        data: '{"token":"' + $.session.Token + '", "registerId":"' + registerId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getSplitCategoriesSubCategoriesAsync(CategoryID) {
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
          '/getSplitCategoriesSubCategories/',
        data: JSON.stringify({
          token: $.session.Token,
          categoryID: CategoryID,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  return {
    getAccountTransectionEntriesAsync,
    getActiveAccountAsync,
    getPayeesAsync,
    getCategoriesAsync,
    getSubCategoriesAsync,
    getCategoriesSubCategoriesByPayeeAsync,
    insertPayeeAsync,
    insertAccountAsync,
    getAccountEntriesByIDAsync,
    deleteConsumerFinanceAccountAsync,
    getActiveEmployeesAsync,
    addCFAttachment,
    deleteCFAttachment,
    getCFAttachmentsList,
    getConsumerNameByID,
    viewCFAttachment,
    getCategoriesSubCategoriesAsync,
    getEditAccountInfoByIdAsync,
    getAccountClassAsync,
    insertEditRegisterAccountAsync,
    getEditAccountAsync,
    getSplitRegisterAccountEntriesByIDAsync,
    getSplitCategoriesSubCategoriesAsync,
  };
})();
