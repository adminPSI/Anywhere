// // clearCard();
// // function clearCard() {
// //   // clear inputs & dropdowns
// //   var locDrop = locationDropdown.querySelector('select');
// //   var startInput = startTimeInput.querySelector('input');
// //   var endInput = endTimeInput.querySelector('input');
// //   var hoursInput = totalHoursInput.querySelector('input');
// //   if (!isEdit) locDrop.value = '';
// //   startInput.value = '';
// //   startTime = null;
// //   endInput.value = '';
// //   endTime = null;
// //   hoursInput.value = '';
// //   endTimeClicks = 0;

// //   // Hide evv reason code
// //   if (evvDateCheck) {
// //     reasonInput.style.display = 'none';
// //   } else {
// //     reasonDropdown.style.display = 'none';

// //     const reasonCodeDropdown = reasonDropdown.querySelector('select');
// //     reasonCodeDropdown.value = '';
// //     reasonCodeDropdown.classList.remove('error');
// //   }
// //   attestCheckbox.style.display = 'none';

// //   // const reasonCodeDropdown = reasonDropdown.querySelector('select');
// //   // reasonCodeDropdown.value = '';
// //   // reasonCodeDropdown.classList.remove('error');
// //   // document.querySelector('.timeCard__evv').style.display = 'none';
// //   // document.querySelector('.timeCard__evvattestChk').style.display = 'none';
// //   defaultTimesChanged = false;
// //   defaultStartTimeChanged = false;
// //   defaultEndTimeChanged = false;
// //   reasonRequired = false;

// //   evvAttest = null;
// //   evvCommunity = null;
// //   evvReasonCode = null;
// //   locationTypeCode = null;

// //   // clear selected consumers
// //   if (isEdit) {
// //   }

// //   //clearConsumerSection();
// //   checkPermissions();
// // }

// //
// // function checkEvv() {
// // var isDisabled = reasonDropdown.classList.contains('disabled');
// // var reasonSelect = reasonDropdown.querySelector('select');
// // var currentValue = reasonSelect.value;
// // if (isDisabled) {
// //   reasonDropdown.classList.remove('error');
// // } else {
// //   if (
// //     currentValue === '%' ||
// //     (currentValue === '' && reasonRequired && (!evvReasonCode || evvReasonCode === '%') && defaultTimesChanged)
// //   ) {
// //     if (reasonDropdown.style.display !== 'none') {
// //       reasonDropdown.classList.add('error');
// //     }
// //   } else {
// //         reasonDropdown.classList.remove('error');
// //   }
// // }
// // }

// // setupCardEvents()
// // starTimeInput
// // if (isEdit && defaultStartTimeChanged) {
// //  if (evvDateCheck) {
// //    // reason input is show instead of reason dropdown
// //  } else {
// //    reasonDropdown.classList.remove('disabled');
// //    const reasonCodeDropdown = reasonDropdown.querySelector('select');
// //    reasonCodeDropdown.value = '%';
// //    evvReasonCode = '%';
// //    reasonDropdown.classList.add('error');
// //  }
// // }
// // endTimeInput
// // if (isEdit && defaultTimesChanged) {
// //  if (evvDateCheck) {
// //    // reason input is show instead of reason dropdown
// //  } else {
// //    reasonDropdown.classList.remove('disabled');
// //    const reasonCodeDropdown = reasonDropdown.querySelector('select');
// //    reasonCodeDropdown.value = '%';
// //    evvReasonCode = '%';
// //    reasonDropdown.classList.add('error');
// //  }
// // }

// // populateReasonDropdown() remove below
// // const reasonInput = document.getElementById('reasonInput');
// // if (reasonInput) {
// //   if (!reasonCodeValue) {
// //     reasonCodeValue = '99 - Documentation on file supports manual change';
// //     evvReasonCode = '99';
// //   }
// //   reasonInput.value = reasonCodeValue;
// // }

// // add this new function below
// // function populateReasonInput() {
// //   const reasonInput = document.getElementById('reasonInput');
// //   if (reasonInput) {
// //     if (!reasonCodeValue) {
// //       reasonCodeValue = '99 - Documentation on file supports manual change';
// //     }
// //     if (!evvReasonCode) {
// //       evvReasonCode = '99';
// //     }
// //     reasonInput.value = reasonCodeValue;
// //   }
// // }

// // evvCheck (replace else logic with new removeEvv()
// // if (
// //     isBillable === 'Y' &&
// //     defaultTimesChanged &&
// //     wcServiceType === 'A' &&
// //     sendEvvData === 'Y' &&
// //     (reasonRequired === true || isEVVSingleEntry)
// // ) {
// //     showEvv();
// //       // evvCheckConsumerEligibilityExistingConsumers();
// //   } else {
// //       document.querySelector('.timeCard__evv').style.display = 'none';
// //       document.querySelector('.timeCard__evvattestChk').style.display = 'none';
// //       reasonRequired = false;
// //   }

// // new showEvv() and hideEvv()
// // function showEvv() {
// //   if (evvDateCheck) {
// //     locationTypeDropdown.style.display = 'flex';
// //     reasonInput.style.display = 'flex';

// //     if (!locationTypeCode) {
// //       locationTypeCode = '1';
// //     }

// //     populateReasonInput();
// //   } else {
// //     reasonDropdown.style.display = 'flex';
// //     populateReasonCodeDropdown();
// //   }
// //   attestCheckbox.style.display = 'inline-flex';

// //   // populateReasonCodeDropdown();
// //   // document.querySelector('.timeCard__evv').style.display = 'flex';
// //   // document.querySelector('.timeCard__evvattestChk').style.display = 'flex';
// //   // if (eVVChangeDate != '' && $.session.stateAbbreviation == 'OH' && todayDate >= eVVChangeDate) {
// //   //   document.querySelector('.timeCard__LocationEvv').style.display = 'flex';
// //   //   if (!locationTypeCode) {
// //   //     locationTypeCode = '1';
// //   //   }
// //   // }
// // }
// // function hideEvv() {
// //   reasonRequired = false;

// //   if (evvDateCheck) {
// //     reasonInput.style.display = 'none';
// //   } else {
// //     reasonDropdown.style.display = 'none';
// //   }

// //   attestCheckbox.style.display = 'none';
// // }

// // new buildTimeEntrySection()
// function buildTimeEntrySection() {
//   var section = document.createElement('div');
//   section.classList.add('timeCard__timeEntry');
//   // dropdowns
//   if (!isEdit) payPeriodDropdown = buildPayPeriodDropdown();
//   locationDropdown = buildLocationDropdown();
//   workCodeDropdown = buildWorkCodeDropdown();
//   reasonDropdown = buildEVVReasonDropdown();
//   locationTypeDropdown = buildLocationTypeDropdown();
//   // inputs
//   reasonInput = buildEVVReasontext();
//   dateInput = buildDateInput();
//   startTimeInput = buildStartTimeInput();
//   endTimeInput = buildEndTimeInput();
//   totalHoursInput = buildTotalHoursInput();
//   communityCheckbox = buildCommunityCheckbox();
//   noteInput = buildNoteInput();
//   rejectionReasonInput = buildRejectionReasonInput();
//   attestCheckbox = buildAttestCheckbox();
//   transportationBtn = buildTransportationBtn();

//   var wrap1 = document.createElement('div'); // dates
//   var wrap2 = document.createElement('div'); // dropdowns
//   var wrap3 = document.createElement('div'); // times
//   // var wrap4 = document.createElement('div'); // evv
//   // var wrap5 = document.createElement('div'); // location evv
//   // var wrap6 = document.createElement('div'); // attestCheckbox
//   var wrap7 = document.createElement('div'); // evv + location evv
//   wrap1.classList.add('timeCard__date');
//   wrap2.classList.add('timeCard__other');
//   wrap3.classList.add('timeCard__time');
//   // wrap4.classList.add('timeCard__evv');
//   // wrap5.classList.add('timeCard__LocationEvv');
//   // wrap6.classList.add('timeCard__evvattestChk');
//   wrap7.classList.add('timeCard__evv');
//   // wrap7.classList.add('timeCard__evvLocationEvv');

//   //rejection reason should always be disabled!
//   rejectionReasonInput.classList.add('disabled');

//   // date wrap
//   if (!isEdit) wrap1.appendChild(payPeriodDropdown);
//   wrap1.appendChild(dateInput);

//   // dropdown wrap
//   wrap2.appendChild(workCodeDropdown);
//   wrap2.appendChild(locationDropdown);

//   // time wrap
//   wrap3.appendChild(startTimeInput);
//   wrap3.appendChild(endTimeInput);
//   if ($.session.stateAbbreviation === 'IN') {
//     wrap3.appendChild(communityCheckbox);
//   }
//   wrap3.appendChild(totalHoursInput);

//   // evv wrap
//   // hide evv stuff initially
//   if (evvDateCheck) {
//     wrap7.appendChild(reasonInput);
//     wrap7.appendChild(locationTypeDropdown);
//   } else {
//     wrap7.appendChild(reasonDropdown);
//   }
//   wrap7.appendChild(attestCheckbox);

//   if (defaultTimesChanged) {
//     if (evvDateCheck) {
//       locationTypeDropdown.style.display = 'flex';
//       reasonInput.style.display = 'flex';
//     } else {
//       reasonDropdown.style.display = 'flex';
//     }
//     attestCheckbox.style.display = 'inline-flex';
//   } else {
//     if (evvDateCheck) {
//       locationTypeDropdown.style.display = 'none';
//       reasonInput.style.display = 'none';
//     } else {
//       reasonDropdown.style.display = 'none';
//     }
//     attestCheckbox.style.display = 'none';
//   }

//   section.appendChild(wrap1);
//   section.appendChild(wrap2);
//   section.appendChild(wrap3);
//   section.appendChild(wrap7);
//   section.appendChild(noteInput);
//   if (status === 'R') {
//     section.appendChild(rejectionReasonInput);
//   }

//   $.session.singleEntryShowTransportation === 'Y' ? section.appendChild(transportationBtn) : ''; //Show Transportation system preference

//   return section;
// }

// // add to buildcard()
//   eVVChangeDate =
//     $.session.ohioEVVChangeDate !== '' ? new Date($.session.ohioEVVChangeDate.split('-').join('/')) : '';
//   todayDate = new Date(UTIL.getTodaysDate().split('-').join('/'));
//   evvDateCheck = eVVChangeDate !== '' && $.session.stateAbbreviation === 'OH' && todayDate >= eVVChangeDate;
