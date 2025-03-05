const timeEntryDetailsPopup = (function() {
  let consumerSection;
  let loadingSection;
  let transportationSection;

  function buildConsumerSection(consumers) {
    consumerSection.innerHTML = '<div class="sectionHead">Consumers</div>'
    let consumerArr = []
    consumers.forEach(consumer => {
      const lastName = consumer.consumername.split(",")[1];
      const firstName = consumer.consumername.split(",")[0];
      let consumerString = `${lastName}, ${firstName}`;
      consumerString = consumerString.trim();
      consumerArr.push(consumerString);
    });
    consumerArr.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
  });
    consumerArr.forEach(consumer => {
      const consumerDiv = document.createElement('div');
      consumerDiv.classList.add('consumerRow');
      consumerDiv.innerHTML = consumer;
      consumerSection.appendChild(consumerDiv)
    })
  }

  function buildTransportationSection(ed) {
    entryData = ed[0]
    transportationSection.innerHTML = ''
    if (entryData.Transportation_Units === '' && entryData.licensePlateNumber === '') return;
    let trans_type = entryData.Transportation_reimbursable === "N" ? "Company" : "Personal";
    let trans_milage = entryData.Transportation_Units;
    let trans_odStart = entryData.odometerstart;
    let trans_odEnd = entryData.odometerend;
    let trans_destination = entryData.destination;
    let trans_licenseplate = entryData.licensePlateNumber;
    let trans_reason = entryData.reason;
    let trans_origination = entryData.origination;

    transportationSection.innerHTML =  `
    <div class="sectionHead">Transportation</div>
    <div class="transportationRow"><span>Transportation Type: </span>${trans_type}</div>
    ${trans_odStart !== "" ? `<div class="transportationRow"><span>Odometer Start: </span>${trans_odStart}</div>` : ""}
    ${trans_odEnd !== "" ? `<div class="transportationRow"><span>Odometer End: </span>${trans_odEnd}</div>` : ""}
    <div class="transportationRow"><span>Total Miles: </span>${trans_milage}</div>
    ${trans_licenseplate !== "" ? `<div class="transportationRow"><span>License Plate: </span>${trans_licenseplate}</div>` : ""}
    ${trans_origination !== "" ? `<div class="transportationRow"><span>Origination: </span>${trans_origination}</div>` : ""}
    ${trans_destination !== "" ? `<div class="transportationRow"><span>Destination: </span>${trans_destination}</div>` : ""}
    ${trans_reason !== "" ? `<div class="transportationRow"><span>Reason: </span>${trans_reason}</div>` : ""}
    `
  }

  function init(entryId, consumersPresent) {
    consumerSection = document.getElementById("consumerDisplay")
    loadingSection = document.getElementById("loadingDisplay")
    transportationSection = document.getElementById("transportationDisplay")
    let entryData = null
    let consumers = null

    PROGRESS__ANYWHERE.init()
    PROGRESS__ANYWHERE.SPINNER.show(loadingSection, "Gathering Additional Information...")
    let promises = [];

    const getSEData = new Promise((resolve, reject) => {
      singleEntryAjax.getSingleEntryById(entryId, results => {
        entryData = results;
        resolve("gotSEData");
      });
    });
    promises.push(getSEData);
    const getSEConsumers = new Promise((resolve, reject) => {
      singleEntryAjax.getSingleEntryConsumersPresent(entryId, resConsumers => {
        consumers = resConsumers;
        resolve("gotConsumers");
      });
    });
    if (consumersPresent !== "0") promises.push(getSEConsumers);

    Promise.all(promises).then(() => {
      PROGRESS__ANYWHERE.SPINNER.hide()
      buildTransportationSection(entryData, consumers)
      if (consumersPresent !== "0") buildConsumerSection(consumers)
    });
  }

  return {
    init
  };
})();
