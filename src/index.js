import Modal from "./modal/modal";

/**
 * Class to create and control the age gate.
 * @param {object} configuration options.
 * @constructor
 */
export default class AgeGate {

  constructor(config) {

    // Setup config options
    config = config || {};
    config.wrapper = config.wrapper || null;

    // Save references to useful Age Gate elements
    this.el = {
      modal: null,
      wrapper: config.wrapper
    };

    this.init();

  }

  /**
   * initialise the Age Gate.
   * @return {boolean}
   */
  init() {

    if(this.el.wrapper) {

      document.body.appendChild(this.el.wrapper);
      this.el.modal = new Modal({
        wrapper: this.el.wrapper
      });

    } else {

      this.el.modal = new Modal();

    }

    return true;

  }

}
