const TRANS_consumerDocCard = (function () {
let scheduledTimeInput, travelMinInput, addressDropdown, directionsBtn, specialInstructionsBtn, noteInput, ro;

  /**
   * @param {string} consumerId Consumer Id
   * @param {object} cardData Data to populate the card
   * @param {boolean} [ro] Read Only
   */
  function createCard(consumerId, cardData, readOnly = false) {
    const { 
      firstName,
      lastName,
      middleI,
      address1,
      address2,
      city,
      state,
      zip,
      notes, 
      scheduledTime, 
      totalTravelTime,
      pickupOrder,
      directions,
      specialInstructions,
      riderStatus,
      alternateAddress
     } = cardData;

     ro = readOnly;

    const hasDirections = directions ? true : false;
    const hasSpecialInstructions = specialInstructions ? true : false;
    const hasAltAddress = alternateAddress ? true : false;
    const section = DOM.ACTIONCENTER.getAttribute('data-active-section');

    //! Main Card //
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("consumerCardContainer", "collapsable");
    // cardContainer.setAttribute("data-alternate-address", hasAltAddress);
    cardContainer.setAttribute("data-rider-status", riderStatus);
    cardContainer.setAttribute("data-expanded", "false");
    cardContainer.setAttribute("id", `${consumerId}-card`);

    //* Card Heading (Portrait, Name, Buttons, ALT ADDRESS WARNING) //
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("consumerCardHeader");
    const portraitContainer = document.createElement("div");
    portraitContainer.classList.add('portrait')
    portraitContainer.innerHTML = `
      <img 
       src="./images/portraits/${consumerId}.png" 
       onerror="this.src='./images/new-icons/default.jpg'"
      />`;
    // *

    const altAddressWarning = document.createElement('h5');
    altAddressWarning.innerText = 'Alternate Address!'
    altAddressWarning.classList.add('altAddressWarning')

    const nameContainer = document.createElement("div");
    nameContainer.classList.add("consumerCardName");
    nameContainer.innerText = `${lastName}, ${firstName} ${middleI}`;
    const expandBtn = button.build({
      classNames: "expandIcon",
      type: "text",
      icon: "keyArrowDown",
      callback: (event) => {
        expandCard(event, consumerId, cardContainer);
      },
    });
    const attendanceIcon = riderStatus === 'P' ?
    'thumbUp' : riderStatus === 'A' ? 
    'thumbDown' : 'thumbUpDown'
    const attendanceBtn = button.build({
      classNames: 'attendanceIcon',
      type: "text",
      icon: attendanceIcon,
      callback: (event) => {updateRiderStatus(event, consumerId, cardContainer)},
    });
    const headerButtons = document.createElement("div");
    headerButtons.classList.add("btnWrap");
    headerButtons.appendChild(expandBtn);
    if (!ro && section !== 'addroute') headerButtons.appendChild(attendanceBtn);
    cardHeader.appendChild(portraitContainer);
    cardHeader.appendChild(nameContainer);
    if (hasAltAddress) cardHeader.appendChild(altAddressWarning);
    cardHeader.appendChild(headerButtons);
    cardContainer.appendChild(cardHeader);
    // !

    /*
      ! Collapsed Items
        * update/change address (Manage route Only)
        * Address
        * Directions BTN
        * Special Instructions BTN
        * Scheduled Time
        * Travel Min
        * Note
        * Delete Consumer BTN
    */

    // * Address
    // Google Maps Search Information: https://developers.google.com/maps/documentation/urls/get-started#top_of_page
    const googleAddress = createGoogleAddress(address1, address2, city, state, zip)
    const addressDiv = document.createElement("a");
    if (googleAddress) {
      addressDiv.classList.add("address", "content", "hidden");
      addressDiv.target = "_blank"; // < new tab
      addressDiv.href = `https://www.google.com/maps/dir/?api=1&destination=${googleAddress}`;
      addressDiv.innerText = `${address1} ${address2}, ${city} ${state}, ${zip}`;  
    } else {
      addressDiv.innerText = `This consumer does not have an assoicated address`;  
      addressDiv.style.color = '#DB162f';
    }
    addressDiv.tabIndex = -1;
    //
    // * Directions and Special Instructions
    directionsBtn = button.build({
      text: 'Directions',
      style: 'secondary',
      type: 'contained',
      tabindex: -1,
      callback: () => {dirSpecInsPopup({
        type: "directions",
        address: "",
        consumerId: consumerId,
        btn: directionsBtn
      })}
    });
    if (hasDirections) directionsBtn.classList.add('attention')
    specialInstructionsBtn = button.build({
      text: 'Special Instructions',
      style: 'secondary',
      type: 'contained',
      tabindex: -1,
      callback: () => {dirSpecInsPopup({
        type: "specialInstructions",
        consumerId: consumerId,
        btn: specialInstructionsBtn
      })}
    });
    if (hasSpecialInstructions) specialInstructionsBtn.classList.add('attention')
    const dirSpecBtnWrap = document.createElement('div');
    dirSpecBtnWrap.classList.add('btnWrap');
    dirSpecBtnWrap.classList.add('dirSpecWrap');
    dirSpecBtnWrap.appendChild(directionsBtn);
    dirSpecBtnWrap.appendChild(specialInstructionsBtn);
    //
    // * Address Dropdown (if needed)
    addressDropdown = dropdown.build({
      label: 'Change Address',
      className: 'consumerAddressDropdown'
    })
    //* Travel time and min //
    const travelContainer = document.createElement("div");
    travelContainer.classList.add("content", "travelWrap", "hidden");
    scheduledTimeInput = input.build({
      id: `${consumerId}-timeInput`,
      label: "Scheduled Time",
      type: "time",
      style: "secondary",
      tabindex: -1,
      value: scheduledTime
    });
    travelMinInput = input.build({
      id: `${consumerId}-travelMin`,
      label: "Travel(Min)",
      tabindex: -1,
      value: totalTravelTime
    });

    travelContainer.appendChild(scheduledTimeInput);
    travelContainer.appendChild(travelMinInput);

    // * Pick-up Order
    pickupOrderInput = input.build({
      id: `${consumerId}-pickupOrder`,
      label: "Pick-up Order",
      tabindex: -1,
      value: pickupOrder 
    });

    pickupOrderInput.classList.add('pickuporder');

    // * Note
    noteInput = input.build({
      label: 'Notes',
      type: 'textarea',
      tabindex: -1,
      value: notes
    })
    //
    // * Delete Consumer
    const deleteConsumerBtn = button.build({
      id: `${consumerId}-delConsumer`,
      text: 'Remove Consumer',
      style: 'secondary',
      type: 'contained',
      tabindex: -1,
      callback: event => removeConsumerCard(event, consumerId, cardContainer)
    });
    const deleteConsumerBtnWrap = document.createElement('div');
    deleteConsumerBtnWrap.classList.add('btnWrap');
    deleteConsumerBtnWrap.classList.add('delConsumerBtnWrap');
    deleteConsumerBtnWrap.appendChild(deleteConsumerBtn);
    //

    cardContainer.appendChild(addressDiv);
    cardContainer.appendChild(dirSpecBtnWrap);
    if (section === 'editRoute' && !ro) {
      cardContainer.appendChild(addressDropdown)
      populateAddressDropdown(consumerId, addressDropdown, alternateAddress)
      altAddressEventListener(consumerId)
    }
    cardContainer.appendChild(travelContainer);
    cardContainer.appendChild(pickupOrderInput)
    cardContainer.appendChild(noteInput);
    if (!ro) cardContainer.appendChild(deleteConsumerBtnWrap);


    if (section === 'routeDocumentation') {
     // scheduledTimeInput.classList.add('disabled')
     // travelMinInput.classList.add('disabled')
     // noteInput.classList.add('disabled')
      pickupOrderInput.classList.add('disabled')
    }

    eventListeners(consumerId)

    return cardContainer;
  }

  function altAddressEventListener(consumerId) {
    addressDropdown.addEventListener('change', event => {
      const addressCode = event.target.value;
      let dir, specInstr;
      if (addressCode !== "") {
        const altAddress = TRANS_mainLanding.getAlternateAddress(consumerId);
        const altAddressInfo = altAddress.filter(address => address.code === addressCode)[0];
        dir = altAddressInfo.directions
        specInstr = altAddressInfo.specialInstructions
      } else {
        dir = getSectionConsumerData(consumerId, 'defaultDirections')
        specInstr = getSectionConsumerData(consumerId, 'defaultSpecialInstructions')
      }
      updateSectionConsumerData({consumerId: consumerId, key: 'directions', value: dir})
      updateSectionConsumerData({consumerId: consumerId, key: 'specialInstructions', value: specInstr})
      dir === "" ? directionsBtn.classList.remove('attention') : directionsBtn.classList.add('attention');
      specInstr === "" ? specialInstructionsBtn.classList.remove('attention') : specialInstructionsBtn.classList.add('attention');
    })
  }

  function eventListeners(consumerId) {
    scheduledTimeInput.addEventListener('change', event => {
      updateSectionConsumerData({consumerId: consumerId, key: 'scheduledTime', value: event.target.value})
    })
    travelMinInput.addEventListener('change', event => {
      updateSectionConsumerData({consumerId: consumerId, key: 'totalTravelTime', value: event.target.value})
    })
    pickupOrderInput.addEventListener('change', event => {
      updateSectionConsumerData({consumerId: consumerId, key: 'pickupOrder', value: event.target.value})
    });
    noteInput.addEventListener('change', event => {
      updateSectionConsumerData({consumerId: consumerId, key: 'notes', value: event.target.value})
    });
    
  }

  function dirSpecInsPopup(opts) {
    const { type, address, consumerId, btn } = opts;
    const popup = POPUP.build({});
    const textinput = input.build({
      label: type === 'directions' ? "Directions" : "Special Instructions",
      type: 'textarea',
      value: getSectionConsumerData(consumerId, type)
    });
    function saveCallback() {
      const newVal = textinput.querySelector('textarea').value;
      const updateData = {consumerId: consumerId, key: type, value: newVal}
      updateSectionConsumerData(updateData)
      if (newVal === "") {
        btn.classList.remove('attention')
      } else btn.classList.add('attention')
    }
    const saveBtn = button.build({
      text: 'save',
      style: 'secondary',
      type: 'contained',
      icon: 'save',
      callback: () => {
        POPUP.hide(popup)
        saveCallback()
      }
    });
    saveBtn.style.width = '100%';
    if (address) {
      const addressDiv = document.createElement("a");
      addressDiv.classList.add("address", "content", "hidden");
      addressDiv.target = "_blank"; // < new tab
      addressDiv.href = `https://www.google.com/maps/dir/?api=1&destination=1+Capitol+Square+columbus+oh+43215`;
      addressDiv.innerText = `1 Capitol Square, Columbus, OH 43215`
      popup.appendChild(addressDiv)
    } 
    if (ro) textinput.classList.add('disabled')
    popup.appendChild(textinput)
    if (!ro) popup.appendChild(saveBtn)
    POPUP.show(popup)
  }

  function createGoogleAddress(address1, address2, city, state, zip) {
    if (address1 === "" && address2 === "" ) return null;
    address1 = address1.trim();
    address2 = address2.trim();
    city = city.trim();
    state = state.trim();
    zip = zip.trim();
    address1.replace(/\s/g, '+');
    address2.replace(/\s/g, '+');
    return `${address1}+${address2}+${city}+${state}+${zip}`
  }

  function populateAddressDropdown(consumerId, addressDropdown, altAddressCode) {
    const addresses = TRANS_mainLanding.getAlternateAddress(consumerId);
    const dropdownData = []
    if (addresses) {
      addresses.forEach(address => {
        dropdownData.push({
          value: address.code,
          text: `Alternate Address ${address.code} - ${address.address1}`
        })
      })
    }
    dropdownData.unshift({value: "", text: "Default Address"})
    dropdown.populate(addressDropdown, dropdownData, altAddressCode)
    function addressChangeAction(event) {
      updateSectionConsumerData({consumerId: consumerId, key: 'alternateAddress', value: event.target.value})
    }

    addressDropdown.addEventListener('change', event => addressChangeAction(event))
  }

  function expandCard(event, consumerId, cardContainer) {
    // debugger
    const expanded = cardContainer.getAttribute("data-expanded");
    if (expanded === "false") {
      cardContainer.setAttribute("data-expanded", "true");
      // cardContainer.querySelector("expandIcon").style.transform = "rotate(-180deg)";
    } else {
      cardContainer.setAttribute("data-expanded", "false");
      // cardContainer.querySelector("expandIcon").style.transform = "rotate(0deg)";
    }

    const content = cardContainer.querySelectorAll(".content");
    content.forEach((element) => {
      if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
      } else {
        element.classList.add("hidden");
      }
    });
  }

  function updateRiderStatus(event, consumerId, cardContainer) {
    let updateData
    const riderStatus = cardContainer.getAttribute("data-rider-status");
    switch (riderStatus) {
      case 'P':
        // P updates to A
        updateData = {consumerId: consumerId, key: 'riderStatus', value: 'A'}
        cardContainer.setAttribute("data-rider-status", 'A');
        cardContainer.querySelector('.attendanceIcon').innerHTML = icons.thumbDown
        break;
      case 'A':
        // A updates to blank
        updateData = {consumerId: consumerId, key: 'riderStatus', value: ''}
        cardContainer.setAttribute("data-rider-status", '');
        cardContainer.querySelector('.attendanceIcon').innerHTML = icons.thumbUpDown

        break;
      default:
        //blank updates to P
        updateData = {consumerId: consumerId, key: 'riderStatus', value: 'P'}
        cardContainer.setAttribute("data-rider-status", 'P');
        cardContainer.querySelector('.attendanceIcon').innerHTML = icons.thumbUp
        break;
    }
    updateSectionConsumerData(updateData);
  }

  function updateSectionConsumerData(updateData) {
    const section = DOM.ACTIONCENTER.getAttribute('data-active-section');
    switch (section) {
      case 'addroute':
        TRANS_addRoute.updateConsumerData(updateData)
        break;
      case 'routeDocumentation':
        TRANS_routeDocumentation.updateConsumerData(updateData)
        break;
      case 'editRoute':
        TRANS_manageEditRoute.updateConsumerData(updateData)
        break;
      default:
        console.error('warning, could not determine which section this consumer was removed from')
        break;
    }
  }
  function getSectionConsumerData(consumerId, key) {
    const section = DOM.ACTIONCENTER.getAttribute('data-active-section');
    switch (section) {
      case 'addroute':
        return TRANS_addRoute.retrieveConsumerData(consumerId, key)
      case 'routeDocumentation':
        return TRANS_routeDocumentation.retrieveConsumerData(consumerId, key)
      case 'editRoute':
        return TRANS_manageEditRoute.retrieveConsumerData(consumerId, key)
      default:
        console.error('warning, could not determine which section this consumer was removed from')
        break;
    }
  }

  function removeConsumerCard(event, consumerId, cardContainer) {
    function accpetCallback() {
      cardContainer.remove();
      roster2.removeConsumerFromActiveConsumers(consumerId)
      // Section specific actions
      const section = DOM.ACTIONCENTER.getAttribute('data-active-section');
      switch (section) {
        case 'addroute':
          TRANS_addRoute.consumerRemoveAction(consumerId)
          break;
        case 'routeDocumentation':
          TRANS_routeDocumentation.consumerRemoveAction(consumerId)
          break;
        case 'editRoute':
          TRANS_manageEditRoute.consumerRemoveAction(consumerId)
          break;
        default:
          console.error('warning, could not determine which section this consumer was removed from')
          break;
      }
    }
    UTIL.warningPopup({
      message: 'Are you sure you would like to remove this consumer from the route?',
      accept: {text: 'Yes', callback: accpetCallback},
      reject: {text: 'No', callback: () =>{}}
    })
  }
  return {
    createCard,
  };
})();
