const planIntroduction = (() => {
  let isReadOnly;
  let planId;
  let likeAdmire;
  let thingsImportantTo;
  let thingsImportantFor;
  let howToSupport;
  let usePlanImage;
  let consumerIdForPhoto;
  let selectedConsumerId;
  let consumerImage;
  let consumerImageURL;
  let charLimits;

  async function updateIntroduction() {
    await planIntroductionAjax.updatePlanIntroduction(
      $.session.Token,
      planId,
      selectedConsumerId,
      likeAdmire,
      thingsImportantTo,
      thingsImportantFor,
      howToSupport,
      usePlanImage,
      consumerImage,
    );
  }

  function buildIntroduction() {
    const introduction = document.createElement('div');
    introduction.classList.add('outcome');

    //photo display
    var img = document.createElement('img');
    img.classList.add('imageContainer');

    // No Photo radio button
    const noPhotoRadio = input.buildRadio({
      id: `noPhotoRadio`,
      text: 'No Photo',
      name: 'chkUseImage',
      isChecked:
        usePlanImage === '' || usePlanImage === null || usePlanImage === '2' ? true : false,
      // isDisabled: isReadOnly,
      callback: () => {
        // if (!isReadOnly) photoInput.classList.add('disabled');
        // Retrieve the demographics DEFAULT Picture from images folder and place it in img
        // var fullpath = `./images/portraits/default.png`;
        var fullpath = `./images/new-icons/default.jpg`;
        var imgElement = document.getElementsByClassName('imageContainer');
        imgElement[0].setAttribute('src', fullpath);
        usePlanImage = 2;
        updateIntroduction();
      },
    });

    displayNoPhoto();

    // Demographics radio button
    const demoPhotoRadio = input.buildRadio({
      id: `chkUsePlanImage-no`,
      text: 'Use Demographics Photo',
      name: 'chkUseImage',
      isChecked: usePlanImage === '0' ? true : false,
      isDisabled: isReadOnly,
      callback: () => {
        if (!isReadOnly) photoInput.classList.add('disabled');
        // Retrieve the demographics Picture from images folder and place it in img
        var fullpath = `./images/portraits/${selectedConsumerId}.png`;
        var imgElement = document.getElementsByClassName('imageContainer');
        imgElement[0].setAttribute('src', fullpath);
        usePlanImage = 0;
        updateIntroduction();

        displayDemographicsPhoto();
      },
    });

    displayDemographicsPhoto();

    // Custom Image (Plan) radio button
    const customPhotoRadio = input.buildRadio({
      id: `chkUsePlanImage-yes`,
      text: 'Use Custom Image',
      name: 'chkUseImage',
      isChecked: usePlanImage === '1' ? true : false,
      isDisabled: isReadOnly,
      callback: async () => {
        usePlanImage = 1;
        consumerImage = '';
        if (!isReadOnly) photoInput.classList.remove('disabled');
        await updateIntroduction();
        const planIntroductionData = await planIntroductionAjax.getPlanIntroduction({
          token: $.session.Token,
          planId: planId,
          consumerId: selectedConsumerId,
        });

        consumerImage = planIntroductionData.consumerImage;
        displayPlanIntroductionPhoto();
      },
    });

    displayPlanIntroductionPhoto();

    // File Selection Input
    var photoInput = input.build({
      id: `selectImage`,
      label: 'Choose Image',
      type: 'file',
      accept: 'image/*',
      style: 'secondary',
      attributes: [{ key: 'multiple', value: 'false' }],
    });

    photoInput.addEventListener('change', event => {
      const photoObj = {};

      const attPromise = new Promise(resolve => {
        const photoFile = event.target.files.item(0);
        const photoName = photoFile.name;
        const photoType = photoFile.name.split('.').pop();
        photoObj.description = photoName;
        photoObj.type = photoType;
        // new Response(file) was added for Safari compatibility
        new Response(photoFile).arrayBuffer().then(res => {
          photoObj.arrayBuffer = res;
          resolve();
        });
      });
      attPromise.then(async () => {
        try {
          consumerImage = photoObj.arrayBuffer;
          refreshPlanIntroductionPhoto(event);
        } catch (error) {
          throw error;
        }
      });
    });

    // build radio buttons and photo selector
    const imageTitle = document.createElement('h4');
    imageTitle.innerHTML = 'Photo';
    const imageContainer = document.createElement('div');
    const radioDiv1 = document.createElement('div');
    const radioDiv2 = document.createElement('div');
    const radioDiv3 = document.createElement('div');
    const imageframe = document.createElement('div');
    imageframe.classList.add('imageframe');
    const photoSelectDiv = document.createElement('div');
    radioDiv1.appendChild(noPhotoRadio);
    radioDiv2.appendChild(demoPhotoRadio);
    // TODOJOE: Position the image so that it is next to other elements (not so far to right)
    imageframe.appendChild(img);
    radioDiv3.appendChild(customPhotoRadio);
    photoSelectDiv.appendChild(photoInput);
    photoSelectDiv.classList.add('photoSelectorContainer');
    imageContainer.appendChild(imageTitle);
    imageContainer.appendChild(radioDiv1);
    imageContainer.appendChild(radioDiv2);
    imageContainer.appendChild(imageframe);
    imageContainer.appendChild(radioDiv3);
    imageContainer.appendChild(photoSelectDiv);
    imageContainer.classList.add('imageSelectionContainer');

    // likeAdmire textarea
    const likeAdmireInput = input.build({
      label: 'What People Like and Admire About Me',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: likeAdmire,
      charLimit: charLimits.likeAdmire,
      forceCharLimit: true,
    });
    likeAdmireInput.classList.add('introTextArea');
    likeAdmireInput.addEventListener('input', e => {
      likeAdmire = e.target.value;
      usePlanImage = usePlanImage == null || usePlanImage == '' || usePlanImage == 0 ? 0 : 1;
      updateIntroduction();
    });

    // thingsImportantTo textarea
    const thingsImportantToInput = input.build({
      label: 'A Few Things That Are Important to Me',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: thingsImportantTo,
      charLimit: charLimits.thingsImportantTo,
      forceCharLimit: true,
    });
    thingsImportantToInput.classList.add('introTextArea');
    thingsImportantToInput.addEventListener('input', e => {
      thingsImportantTo = e.target.value;
      usePlanImage = usePlanImage == null || usePlanImage == '' || usePlanImage == 0 ? 0 : 1;
      updateIntroduction();
    });

    // thingsImportantFor textarea
    const thingsImportantForInput = input.build({
      label: 'A Few Things That Are Important for Me',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: thingsImportantFor,
      charLimit: charLimits.thingsImportantFor,
      forceCharLimit: true,
    });
    thingsImportantForInput.classList.add('introTextArea');
    thingsImportantForInput.addEventListener('input', e => {
      thingsImportantFor = e.target.value;
      usePlanImage = usePlanImage == null || usePlanImage == '' || usePlanImage == 0 ? 0 : 1;
      updateIntroduction();
    });

    // howToSupport textarea
    const howToSupportInput = input.build({
      label: 'Here is How You Can Support Me',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: howToSupport,
      charLimit: charLimits.howToSupport,
      forceCharLimit: true,
    });
    howToSupportInput.classList.add('introTextArea');
    howToSupportInput.addEventListener('input', e => {
      howToSupport = e.target.value;
      usePlanImage = usePlanImage == null || usePlanImage == '' || usePlanImage == 0 ? 0 : 1;
      updateIntroduction();
    });

    introduction.appendChild(imageContainer);
    introduction.appendChild(likeAdmireInput);
    introduction.appendChild(thingsImportantToInput);
    introduction.appendChild(thingsImportantForInput);
    introduction.appendChild(howToSupportInput);

    DOM.ACTIONCENTER.appendChild(introduction);
    // if custom image radio button is selected, enable the file/photo select functionality
    let customPhotoRadio2 = document.getElementById('chkUsePlanImage-yes');
    if (customPhotoRadio2.checked == true) {
      photoInput.classList.remove('disabled');
    } else {
      photoInput.classList.add('disabled');
    }

    if (isReadOnly) {
      likeAdmireInput.classList.add('disabled');
      thingsImportantToInput.classList.add('disabled');
      thingsImportantForInput.classList.add('disabled');
      howToSupportInput.classList.add('disabled');
      // let demoPhotoRadio = document.getElementById('chkUsePlanImage-no');
      // let customPhotoRadio = document.getElementById('chkUsePlanImage-yes');
      // demoPhotoRadio.disabled = true;
      // customPhotoRadio.disabled = true;
      photoInput.classList.add('disabled');
    }

    return introduction;
  }

  function getMarkup() {
    const section = document.createElement('div');
    section.classList.add('ispIntroduction');
    const heading = document.createElement('h2');
    heading.innerHTML = 'Introduction';
    heading.classList.add('sectionHeading');
    heading.style.marginBottom = '24px';
    section.appendChild(heading);

    // let linebreak = document.createElement("br");
    // section.appendChild(linebreak);
    const introduction = buildIntroduction();
    section.appendChild(introduction);

    return section;
  }

  function displayDemographicsPhoto() {
    // if portrait exists in image/portraits, then enable demoPhotoRadio; otherwise, disable it
    var id = consumerIdForPhoto;
    id = parseInt(id);
    var fullpath = `./images/portraits/${id}.png`;
    var myImage = new Image();
    myImage.src = fullpath;
    myImage.onload = function () {
      let demoPhotoRadio = document.getElementById('chkUsePlanImage-no');
      demoPhotoRadio.disabled = isReadOnly;
      // display Demographics photo
      if (demoPhotoRadio.checked == true) {
        var fullpath = `./images/portraits/${consumerIdForPhoto}.png`;
        var imgElement = document.getElementsByClassName('imageContainer');
        imgElement[0].setAttribute('src', fullpath);
      }
    };
    myImage.onerror = function () {
      let demoPhotoRadio = document.getElementById('chkUsePlanImage-no');
      // display Silhouette photo
      if (demoPhotoRadio.checked == true) {
        var imgElement = document.getElementsByClassName('imageContainer');
        imgElement[0].setAttribute('src', './images/new-icons/default.jpg');
      }
      demoPhotoRadio.disabled = true;
      demoPhotoRadio.checked = false;
    };
  }

  function displayNoPhoto() {
    var fullpath = `./images/new-icons/default.jpg`;
    var myImage = new Image();
    myImage.src = fullpath;
    myImage.onload = function () {
      let noPhotoRadio1 = document.getElementById('noPhotoRadio');
      // display default photo silhouette
      if (noPhotoRadio1.checked == true) {
        var fullpath = `./images/new-icons/default.jpg`;
        var imgElement = document.getElementsByClassName('imageContainer');
        imgElement[0].setAttribute('src', fullpath);
      }
    };
  }

  function displayPlanIntroductionPhoto() {
    if (consumerImage) {
      const binaryString = window.atob(consumerImage);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'image/jpg' });
      var urlCreator = window.URL || window.webkitURL;
      consumerImageURL = urlCreator.createObjectURL(blob);

      var myImage2 = new Image();
      myImage2.src = consumerImageURL;

      myImage2.onload = function () {
        let customPhotoRadio = document.getElementById('chkUsePlanImage-yes');
        // display Plan (ie, Custom) photo
        if (customPhotoRadio.checked == true) {
          var imgElement = document.getElementsByClassName('imageContainer');
          imgElement[0].setAttribute('src', consumerImageURL);
        }
      };

      myImage2.onerror = function (errorMsg) {
        let customPhotoRadio = document.getElementById('chkUsePlanImage-yes');
        // display Silhouette photo
        if (customPhotoRadio.checked == true) {
          var imgElement = document.getElementsByClassName('imageContainer');
          imgElement[0].setAttribute('src', './images/new-icons/default.jpg');
        }
      };
    } else {
      var myImage3 = new Image();
      myImage3.src = '';
      myImage3.onerror = function (errorMsg) {
        let customPhotoRadio = document.getElementById('chkUsePlanImage-yes');
        // display Silhouette photo
        if (customPhotoRadio.checked == true) {
          var imgElement = document.getElementsByClassName('imageContainer');
          imgElement[0].setAttribute('src', './images/new-icons/default.jpg');
        }
      };
    }
  }

  function refreshPlanIntroductionPhoto(event) {
    var imgElement = document.getElementsByClassName('imageContainer');
    imgElement[0].setAttribute('src', URL.createObjectURL(event.target.files[0]));
    usePlanImage = 1;
    updateIntroduction();
    // }
  }

  async function init(data) {
    isReadOnly = data.readOnly;
    planId = data.planId;
    charLimits = planData.getISPCharacterLimits('introduction');

    var activeConsumers = roster2.getActiveConsumers();
    selectedConsumerId = activeConsumers[activeConsumers.length - 1].id;

    const selectedConsumer = plan.getSelectedConsumer();
    consumerIdForPhoto =
      $.session.applicationName === 'Advisor' ? selectedConsumer.consumerId : selectedConsumer.id;

    const planIntroductionData = await planIntroductionAjax.getPlanIntroduction({
      token: $.session.Token,
      planId: planId,
      consumerId: selectedConsumerId,
    });

    likeAdmire = planIntroductionData.likeAdmire;
    thingsImportantTo = planIntroductionData.thingsImportantTo;
    thingsImportantFor = planIntroductionData.thingsImportantFor;
    howToSupport = planIntroductionData.howToSupport;
    usePlanImage = planIntroductionData.usePlanImage;
    consumerImage = planIntroductionData.consumerImage;
  }

  return { init, getMarkup };
})();
