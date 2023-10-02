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

    var incidents = {};
    res.forEach(r => {
      if (!incidents[r.incidentId]) {
        incidents[r.incidentId] = r;
      } else {
        const dupName = incidents[r.incidentId].consumerName.includes(r.consumerName);
        if (!dupName) {
          incidents[r.incidentId].consumerName += `, ${r.consumerName}`;
        }
        incidents[r.incidentId].viewedBy += `, ${r.viewedBy}`;
      }
    });

    var keys = Object.keys(incidents);

    var data = keys
      .filter(k => {
        var obj = incidents[k];

        if ($.session.incidentTrackingViewPerm.length !== 0) {
          if (
            obj.description !== '' &&
            !$.session.incidentTrackingViewPerm.includes(obj.description.toLowerCase())
          ) {
            return false;
          }
        }

        return true;
      })
      .map(r => {
        var obj = incidents[r];

        var name = obj.consumerName.split(',');
        name = `${name[1]}, ${name[0]}`;
        var date = UTIL.abbreviateDateYear(obj.incidentDate.split(' ')[0]);
        var viewedOn = r.viewedOn ? true : false;
        var orginUser =
          obj.originallyEnteredBy.toLowerCase() === $.session.UserId.toLowerCase() ? true : false;
        var userHasViewed = obj.viewedBy.includes($.session.UserId) ? true : false;
        var showBold;

        if (!orginUser && !userHasViewed) {
          showBold = true;
        }

        return {
          values: [name, date, obj.incidentCategory],
          attributes: [{ key: 'data-viewed', value: showBold }],
          id: obj.incidentId,
          onClick: async () => {
            await incidentTrackingAjax.updateIncidentViewByUser({
              token: $.session.Token,
              incidentId: obj.incidentId,
              userId: $.session.UserId,
            });

            incidentTracking.getDropdownData(() => {
              setActiveModuleSectionAttribute('incidentTracking-overview');
              UTIL.toggleMenuItemHighlight('incidenttracking');
              actioncenter.dataset.activeModule = 'incidenttracking';
              reviewIncident.init(obj.incidentId);
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
