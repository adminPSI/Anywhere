const newVendorInfo = (function () {

    let vendorID;
    let ispDiv;
    let ispNav;
    let ispBody;
    let DDNumber;
    let LocalNumber;
    let Phone;

    const sections = [
        {
            title: 'General',
            id: 0,
            markup: () => vendorGeneral.getMarkup(),
        },
        {
            title: 'Services',
            id: 1,
            markup: () => vendorServices.getMarkup(),
        },
        {
            title: 'UCR',
            id: 2,
            markup: () => vendorUCR.getMarkup(),
        },
        {
            title: 'Provider Type',
            id: 3,
            markup: () => vendorProviderType.getMarkup(),
        },
        {
            title: 'Certification',
            id: 4,
            markup: () => vendorCertification.getMarkup(),
        },
        {
            title: 'Location Reviews',
            id: 5,
            markup: () => vendorLocationReview.getMarkup(),
        },

    ];

    async function refreshVendor(vendorId, DDNum, localNum, phone) {
        vendorID = vendorId;
        DDNumber = DDNum;
        LocalNumber = localNum;
        Phone = phone;

        DOM.clearActionCenter();

        var headingWrap = document.createElement('div');
        headingWrap.classList.add('vendorBtnWrap');
        const heading = document.createElement('div');
        const headingName = document.createElement('div');
        const localNumberheading = document.createElement('div');
        const head = document.createElement('div');

        const ispWrap = document.createElement('div');

        ispWrap.id = 'planISP';

        ispWrap.innerHTML = '';

        BACK_BTN = button.build({
            text: 'BACK',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { await vendorInfo.vendorInfoLoad() }, 
        });

        const newIspMarkup = await getMarkup();

        heading.innerHTML = `<h4> Barrier Free Environments: ${Phone}</h4>`;
        headingName.innerHTML = `<h4> DD Number:${DDNumber} </h4>`;
        localNumberheading.innerHTML = `<h4> Local Number:${LocalNumber}</h4>`;
        ispWrap.appendChild(newIspMarkup);

        head.appendChild(heading);
        head.appendChild(headingName);
        head.appendChild(localNumberheading);
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

        await vendorGeneral.init(vendorID);
        await vendorServices.init(vendorID);
        await vendorUCR.init(vendorID);
        await vendorProviderType.init(vendorID);
        await vendorCertification.init(vendorID);
        await vendorLocationReview.init(vendorID);

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
        refreshVendor,
        getMarkup,
    };
})();
