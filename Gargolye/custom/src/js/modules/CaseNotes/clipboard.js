//* FOR CASE NOTE FILTERS
// { billerId, billerName }
// billerDropdownData = await _UTIL.fetchData('getBillersListForDropDownJSON');
// billerDropdownData = billerDropdownData.getBillersListForDropDownJSONResult;
// console.log(billerDropdownData);

// const Singleton = (function () {
//   let instance;

//   function init() {
//     const data = [];

//     return {
//       doStuff() {
//         // do stuff
//       }
//     }
//   }

//   return {
//     load: function () {
//       if (!instance) {
//         instance = init();
//       }

//       return instance;
//     },
//   };
// })();

// // the data inside init function is shared between
// // both single1 and single2
// const single1 = Singleton.load();
// const single2 = Singleton.load();

// 1. convertToGroupNotes === true | only if !isGroupNote && allowGroupNotes
// 2. allowGroupNotes | this gets set on from service code dropdown event
// 3. isGroupNote | set when singleNotToGroupNote is called

//TODO: preSave() stops timer and speech to text

// if (!isGroupNote && allowGroupNotes) {
//* SINGLE NOTE TO GROUP NOTE LOGIC
//TODO: delete existing case note
//TODO: isGroupNote = true
//TODO: set noteId = 0?
//TODO: if (travelTime === null) travelTime = 0;
//TODO: if (documentationTime === null) documentationTime = 0;
//TODO: endTime = endTime.substring(0, 5);
//TODO: startTime = startTime.substring(0, 5);
//TODO: set page load to new?
// }
