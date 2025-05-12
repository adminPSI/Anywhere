(function (global, factory) {
    global.WarningPopup = factory();
})(this, function () {
    /**
     * Default configuration
     * @type {Object}
     */
    const DEFAULT_OPTIONS = {
        className: null,
    };

    function WarningPopup(options) {
        // Data Init
        this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
        this.displayStatus = null;

        // DOM Ref
        this.dialog = null;
        this.messageEle = null;
        this.confirmButton = null;
        this.cancelButton = null;

        this._build();
    }

    WarningPopup.prototype._build = function () {
        this.dialog = new Dialog({ hideX: false, className: this.options.className }); 

        this.messageEle = _DOM.createElement('p', {
            class: 'confirmation__message',
        });

        const btnWrap = _DOM.createElement('div', { class: 'button-wrap' });
        this.confirmButton = new Button({
            text: 'Yes',
            name: 'confirm',
            icon: 'checkmark', 
        });
        this.cancelButton = new Button({
            text: 'No',
            name: 'cancel',
            styleType: 'outlined',  
            icon: 'close',
        });

        this.confirmButton.renderTo(btnWrap);
        this.cancelButton.renderTo(btnWrap);

        this.dialog.dialog.appendChild(this.messageEle);
        this.dialog.dialog.appendChild(btnWrap);
    };

    /**
     * @function
     */
    WarningPopup.prototype._setupEvents = function (cbFunc) {
        this.dialog.dialog.addEventListener('click', e => {
            console.log(e.target);
            cbFunc();
        });
    };

    /**
     * @function
     */
    WarningPopup.prototype.show = function (message) {
        if (this.displayStatus === 'open') return;

        if (message) this.messageEle.innerText = message;
        this.dialog.show();
        this.displayStatus = 'open';

        return new Promise((resolve, reject) => {
            const callbackFunction = e => {
                // e.target is confirm or cancel?
                this.dialog.dialog.removeEventListener('click', callbackFunction);
                this.close();
                resolve(e.target.name);
            };

            this.dialog.dialog.addEventListener('click', callbackFunction);
        });
    };

    /**
     * @function
     */
    WarningPopup.prototype.close = function () {
        this.dialog.close();
        this.displayStatus = 'closed';
    };

    /**
     * Renders the built Confirmation Popup element to the specified DOM node.
     *
     * @function
     * @param {Node} node DOM node to render the Confirmation Popup to
     * @returns {WarningPopup} Returns the current instances for chaining
     */
    WarningPopup.prototype.renderTo = function (node) {
        if (node instanceof Node) {
            node.appendChild(this.dialog.dialog);
        }

        return this;
    };

    return WarningPopup;
});
