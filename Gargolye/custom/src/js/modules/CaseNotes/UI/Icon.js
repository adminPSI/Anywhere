(function (global, factory) {
  global.Icon = factory();
})(this, function () {
  const svg = {
    arrowRight: `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
      </svg>
    `,
    arrowLeft: `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
      </svg>
    `,
    exitFullScreen: `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/>
      </svg>
    `,
    openFullScreen: `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/>
      </svg>
    `,
  };

  const getIcon = name => {
    return _DOM.createElement('span', { html: svg[name], class: 'svgIcon' });
  };

  return {
    getIcon,
  };
});
