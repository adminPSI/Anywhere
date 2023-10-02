const NewEmployment = (function () {

    let PositionId;
    let ispDiv;
    let ispNav;
    let ispBody;
    let consumersId;
    let name;
    let positionName;
    let selectedConsumersName;
    let tabPositionIndex;

    const sections = [
        {
            title: 'Employment Information',
            id: 0,
            markup: () => EmploymentInformation.getMarkup(),
        },
        {
            title: 'Wages & Benefits',
            id: 1,
            markup: () => WagesBenefits.getMarkup(),
        },
        {
            title: 'Position Tasks',
            id: 2,
            markup: () => PositionTask.getMarkup(),
        },
        {
            title: 'Work Schedule',
            id: 3,
            markup: () => WorkSchedule.getMarkup(),
        },

    ];

    async function refreshEmployment(PositionID, Name, PositionName, SelectedConsumersName, selectedConsumersId, TabPosition = 0) {
        PositionId = PositionID;
        consumersId = selectedConsumersId;
        name = Name;
        positionName = PositionName;
        selectedConsumersName = SelectedConsumersName;
        tabPositionIndex = TabPosition;

        DOM.clearActionCenter();

        var headingWrap = document.createElement('div');
        headingWrap.classList.add('employmentBtnWrap');  
        const heading = document.createElement('div');
        const headingName = document.createElement('div');
        const head = document.createElement('div');

        const ispWrap = document.createElement('div');

        ispWrap.id = 'planISP';

        ispWrap.innerHTML = '';

        BACK_BTN = button.build({
            text: 'BACK',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { Employment.loadEmploymentLanding() }, 
        });

        const newIspMarkup = await getMarkup();

        heading.innerHTML = `<h4>${selectedConsumersName}</h4>`;
        headingName.innerHTML = `<h4>${Name} - ${PositionName}</h4>`;
        ispWrap.appendChild(newIspMarkup);

        head.appendChild(heading);
        if (PositionId != undefined)
            head.appendChild(headingName);
        headingWrap.appendChild(head);
        headingWrap.appendChild(BACK_BTN);

        DOM.ACTIONCENTER.appendChild(headingWrap);
        DOM.ACTIONCENTER.appendChild(ispWrap);
        DOM.autosizeTextarea();
    }
    function toggleActiveNavItem(selectedNavItem) {
        const activeNavItem = ispNav.querySelector('.active');

        if (activeNavItem) {
            activeNavItem.classList.remove('active');
        }

        selectedNavItem.classList.add('active');
    }
    function toggleActiveSection(sectionId) {
        const activeSection = ispBody.querySelector('.active');
        const targetSection = ispBody.querySelector(`[data-section-id="${sectionId}"]`);

        if (activeSection) {
            activeSection.classList.remove('active');
        }

        if (sectionId > 0) {
            BACK_BTN.classList.remove('disabled');
        } else if (sectionId == 0 && SAVE_BTN.classList.contains('disabled')) {
            BACK_BTN.classList.remove('disabled');
        } else {
            BACK_BTN.classList.add('disabled'); 
        }        
        targetSection.classList.add('active');
    }

    // Markup
    //---------------------------------------------
    function buildNavigation() {
        const nav = document.createElement('div');
        nav.classList.add('planISP__nav');

        sections.forEach((section, index) => {
            const sectionId = section.id;

            const navItem = document.createElement('div');
            navItem.classList.add('planISP__navItem');
            navItem.innerHTML = `${section.title}`;

            if (tabPositionIndex === index) {
                navItem.classList.add('active');
            }

            navItem.addEventListener('click', e => {
                toggleActiveNavItem(navItem);
                toggleActiveSection(sectionId);
                DOM.autosizeTextarea();
            });

            nav.appendChild(navItem);
        });

        return nav;
    }
    async function buildBody() {
        const body = document.createElement('div');
        body.classList.add('planISP__body');

        await EmploymentInformation.init(PositionId, name, positionName, selectedConsumersName, consumersId);
        await WagesBenefits.init(PositionId, name, positionName, selectedConsumersName, consumersId);
        await PositionTask.init(PositionId, name, positionName, selectedConsumersName, consumersId);
        await WorkSchedule.init(PositionId, name, positionName, selectedConsumersName, consumersId);

        sections.forEach((section, index) => {
            const sectionId = section.id;
            const sectionMarkup = section.markup();
            sectionMarkup.setAttribute('data-section-id', sectionId);
            sectionMarkup.classList.add('planISP__section');

            if (tabPositionIndex === index) {
                sectionMarkup.classList.add('active');
            }

            body.appendChild(sectionMarkup);
        });

        return body;
    }

    async function getMarkup() {
        ispDiv = document.createElement('div');
        ispDiv.classList.add('planISP');

        ispNav = buildNavigation();
        ispDiv.appendChild(ispNav);

        ispBody = await buildBody();
        ispDiv.appendChild(ispBody);

        return ispDiv;
    }

    return {
        refreshEmployment,
        getMarkup,
    };
})();
