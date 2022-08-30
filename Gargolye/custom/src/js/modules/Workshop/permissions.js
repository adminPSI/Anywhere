$.session.defaultWorkshopLocationId 
// if this session varaible is an null, sets 'defaultLocation' to a generic location object {id: 0, text: "Location"}.
// Otherwise, sets 'defaultLocation' to object {id: 'defaultWorkshopLocaitonID', text: ""}.
// ALSO if this session variable is NOT Null, it assigns a variable 'nullLocation to a generic location object {id: 0, text: "Location"}.

$.session.workshopBatchId
// Used in displaySelectBatch ajax call. THis call creates a list of the 'data' that is passed into it. The session variable is being set to 'data.id' of
// the element that is clicked??
