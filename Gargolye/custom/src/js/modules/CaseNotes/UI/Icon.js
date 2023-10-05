'use-strict';

//TODO: set icon height/width props to 24px

(function (global, factory) {
  global = global || self;
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
  };

  const getIcon = name => {
    return _DOM.createElement('span', { html: svg[name], class: 'svgIcon' });
  };

  return {
    getIcon,
  };
});
