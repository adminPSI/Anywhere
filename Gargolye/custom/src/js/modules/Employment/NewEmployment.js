const NewEmployment = (function () {

    let PositionId;
    let ispDiv;
    let ispNav;
    let ispBody;
    let consumersId;
    let name;
    let positionName;
    let selectedConsumersName;

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

    async function refreshEmployment(PositionID, Name, PositionName, SelectedConsumersName, selectedConsumersId) {

        PositionId = PositionID;
        consumersId = selectedConsumersId;
        name = Name;
        positionName = PositionName;
        selectedConsumersName = SelectedConsumersName;

        DOM.clearActionCenter();
        const heading = document.createElement('div');
        const headingName = document.createElement('div');

        const ispWrap = document.createElement('div');

        ispWrap.id = 'planISP';

        ispWrap.innerHTML = '';

        const newIspMarkup = await getMarkup();

        heading.innerHTML = `<h4>${selectedConsumersName}</h4>`;
        headingName.innerHTML = `<h4>${Name} - ${PositionName}</h4>`;
        ispWrap.appendChild(newIspMarkup);

        DOM.ACTIONCENTER.appendChild(heading);
        if (PositionId != undefined)
            DOM.ACTIONCENTER.appendChild(headingName);
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

            if (index === 0) {
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

        await EmploymentInformation.init(PositionId, name, positionName, selectedConsumersName , consumersId);
        await WagesBenefits.init(PositionId);
        await PositionTask.init(PositionId);
        await WorkSchedule.init(PositionId);
        
        sections.forEach((section, index) => {
            const sectionId = section.id;
            const sectionMarkup = section.markup();
            sectionMarkup.setAttribute('data-section-id', sectionId);
            sectionMarkup.classList.add('planISP__section');

            if (index === 0) {
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
