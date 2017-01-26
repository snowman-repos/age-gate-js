import Modal from "./modal/modal";

/**
 * Class to create and control the age gate.
 * @param {object} configuration options.
 * @constructor
 */
export default class AgeGate {

  constructor(config) {

    // Save references to useful Age Gate elements
    this.el = {
      container: this.createContainer(),
      modal: null
    };

    // When there is a body, append the age gate and
    // initialise a new modal
    document.addEventListener("DOMContentLoaded", () => {
       document.body.appendChild(this.el.container);
       this.el.modal = new Modal(this.el.container);
    });

  }

  /**
   * Creates the age gate container element.
   * @return {HTMLNode}
   */
  createContainer() {

    let ageGate = document.createElement("div");
    ageGate.id = "ag-root";
    return ageGate;

  }

}
