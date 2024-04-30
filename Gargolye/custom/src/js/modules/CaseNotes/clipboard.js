// const questionSet = document.getElementById(`set${setId}`);
// let sectionID = questionSet.parentElement.parentElement.id
// sectionID = sectionID.replace(/\D/g, "");
// const questionSetGridRows = [...questionSet.querySelectorAll('.grid__row:not(.grid__rowHeader)')];
// const questionSetActionButtons = [...questionSet.querySelectorAll('.gridActionRow button')];
// let questionSetId = e.target.dataset.setid;
// // let sectionID = e.target.dataset.sectionid;
// questionSetGridRows.forEach(row => {
//   const rowCells = row.querySelectorAll('.grid__cell');

//   rowCells.forEach(cell => {
//     const cellInput = cell.querySelector('.input-field__input');
//     let questionRowId = cell.id;
//     questionRowId = questionRowId.replace(/\D/g, "");

//     addAnswer(cellInput.id, '', '', skipped);

//     if (isChecked) {
//       cellInput.value = '';
//       input.disableInputField(cellInput);
//       //sectionQuestionCount[sectionID][setId][questionId].leaveblank = true;
//       sectionQuestionCount[sectionID][questionSetId][questionRowId].leaveblank = true;
//     } else {
//       input.enableInputField(cellInput);
//       //sectionQuestionCount[sectionID][setId][questionId].leaveblank = false;
//       sectionQuestionCount[sectionID][questionSetId][questionRowId].leaveblank = false;
//     }
//   });
// });
