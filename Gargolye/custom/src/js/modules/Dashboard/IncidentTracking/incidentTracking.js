var incidentTrackingWidget = (function () {
  var tableOptions = {
    plain: true,
    columnHeadings: ['Consumer Involved', 'Date of Incident', 'Category / Subcategory'],
    tableId: 'incidentTrackingWidgetTable',
  };

  function populateIncidentTrackingWidget(res) {
    var widget = document.getElementById('incidenttrackingwidget');
    if (!widget) return;
    var widgetBody = widget.querySelector('.widget__body');

    var itTable = table.build(tableOptions);
    widgetBody.innerHTML = '';
    widgetBody.appendChild(itTable);

    var data = res.map(r => {
      var name = r.consumerName.split(',');
      name = `${name[1]}, ${name[0]}`;
      var date = UTIL.abbreviateDateYear(r.incidentDate.split(' ')[0]);
      var viewedOn = r.viewedOn ? true : false;

      return {
        values: [name, date, r.incidentCategory],
        attributes: [{ key: 'data-viewed', value: viewedOn }],
        id: r.incidentId,
        onClick: () => {
          incidentTracking.getDropdownData(() => {
            setActiveModuleSectionAttribute('incidentTracking-overview');
            UTIL.toggleMenuItemHighlight('incidenttracking');
            actioncenter.dataset.activeModule = 'incidenttracking';
            reviewIncident.init(r.incidentId);
          });
        },
      };
    });
    table.populate(itTable, data);
  }

  function init() {
    incidentTrackingWidgetAjax.getITDashboardWidgetDataAjax(populateIncidentTrackingWidget);
  }

  return {
    init,
  };
})();
