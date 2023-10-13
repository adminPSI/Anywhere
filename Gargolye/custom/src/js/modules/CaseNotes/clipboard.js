//* FOR CASE NOTE FILTERS
// { billerId, billerName }
// billerDropdownData = await _UTIL.fetchData('getBillersListForDropDownJSON');
// billerDropdownData = billerDropdownData.getBillersListForDropDownJSONResult;
// console.log(billerDropdownData);

// FULLSCREEN MODE
if (this.options.fullscreen) {
  // add open fullscreen to orign textarea
  this.fullScreenShowBtn = _DOM.createElement('div', {
    class: 'fullscreenToggleBtn',
    node: Icon.getIcon('openFullScreen'),
  });
  this.inputWrap.appendChild(this.fullScreenShowBtn);

  // dialog modal
  this.fullScreenDialog = new Dialog();
  this.fullScreenTextarea = new Textarea({ ...this.options, ...{ fullscreen: false } });
  this.fullScreenCloseBtn = _DOM.createElement('div', {
    class: 'fullscreenToggleBtn',
    node: Icon.getIcon('exitFullScreen'),
  });

  this.fullScreenDialog.build().renderTo(this.inputWrap);
  this.fullScreenDialog.dialog.appendChild(clonedTextarea);
  this.fullScreenTextarea.inputWrap.appendChild(this.fullScreenCloseBtn);
}

this.fullScreenDialog = null;
this.fullScreenTextarea = null;
this.fullScreenShowBtn = null;
this.fullScreenCloseBtn = null;

if (this.options.fullscreen) {
  this.fullScreenShowBtn.addEventListener('click', e => {
    this.fullScreenDialog.show();
  });
  this.fullScreenCloseBtn.addEventListener('click', e => {
    this.fullScreenDialog.close();
  });
}
