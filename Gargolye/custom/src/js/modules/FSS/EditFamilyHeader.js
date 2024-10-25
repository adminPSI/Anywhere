const EditFamilyHeader = (function () {
    let familyID;
    let ispDiv;
    let ispNav;
    let ispBody;
    let name;
    let tabPositionIndex;

    const sections = [
        {
            title: 'Family',
            id: 0,
            markup: () => EditFamilyInformation.getMarkup(),
        },
        {
            title: 'Members',
            id: 1,
            markup: () => EditMembers.getMarkup(),
        },      
    ];

    async function refreshFamily(FamilyId, Name, TabPosition = 0) {
        familyID = FamilyId;
        name = Name;
        tabPositionIndex = TabPosition;

        DOM.clearActionCenter();

        var headingWrap = document.createElement('div');
        headingWrap.classList.add('familyBtnWrap');
        const heading = document.createElement('div');
        const head = document.createElement('div');

        const ispWrap = document.createElement('div');
        ispWrap.id = 'planISP';
        ispWrap.innerHTML = '';

        BACK_BTN = button.build({
            text: 'BACK',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { EditFamilies.init(); }, 
        });

        const newIspMarkup = await getMarkup();

        heading.innerHTML = `<h4>${name}</h4>`;
        ispWrap.appendChild(newIspMarkup);

        head.appendChild(heading);
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

        await EditFamilyInformation.init(familyID, name);
        await EditMembers.init(familyID, name);

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
        refreshFamily,
        getMarkup,
    };
})();
