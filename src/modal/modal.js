import styles from "./modal.css";

/**
 * Class to create and control a modal window for the age gate; the
 * modal is not shown by default.
 * @param {object} HTMLNode to which the modal will be attached.
 * @constructor
 */
export default class Modal {

  constructor(parent) {

    // Save DOM references
    this.el = {
      body: document.body,
      curtain: null,
      dialog: null,
      parent: parent
    };

    // There are 2 parts to the modal:
    // - curtain: a semi-opaque layer that covers the entire screen
    // - dialog: a dialog box that contains the content
    this.el.curtain = this.createElement("curtain");
    this.el.dialog = this.createElement("dialog");

    // State object
    this.state = {
      shown: false
    };

  }

  /**
   * Creates one of the modal component elements, which can be
   * either curtain or dialog. The function will not create either
   * of those elements twice and will not create elements by any
   * other name. The dialog and curtain elements should be the top-
   * most and second-top-most elements on the page.
   * @param {string} The name of the element to be created, i.e.
   *                 "curtain" or "dialog".
   * @return {object|boolean} False if the element can't be created,
   *                          otherwise a reference to the newly
   *                          created element.
   */
  createElement(element) {

    // TODO: break up this function

    // Do not create other elements
    if(element !== "curtain" && element !== "dialog") {
      return false;
    }

    // Do not create the curtain if it already exists
    if(this.el.curtain !== null && element === "curtain") {
      return false;
    }

    // Do not create the dialog if it already exists
    if(this.el.dialog !== null && element === "dialog") {
      return false;
    }

    // Get the current highest-level element on the page so that
    // newly created elements may be placed on top
    let zindex = this.getHighestZIndex();

    // Create the element, add ID, add class, and set z-index, tabindex,
    // and aria-hidden
    let el = document.createElement("div");
    el.id = "ag-modal-" + element;
    el.classList.add(styles["ag" + element.charAt(0).toUpperCase() + element.slice(1)]);
    el.style.zIndex = zindex + 1;
    el.setAttribute("tabindex", -1);
    el.setAttribute("aria-hidden", "true");

    if(element === "dialog") {
      el.setAttribute("role", "dialog");
    }

    // Append the element to the container
    return(this.el.parent.appendChild(el));

  }

  /**
   * Get the highest (z-index) element on the page.
   * @return {number} The current highest z-index.
   */
  getHighestZIndex() {

    // Get a collection of all elements on the page
    let elements = document.getElementsByTagName("*");
    let highest = 0;

    // Loop through all elements
    for(let i = 0; i < elements.length; i++) {

      // Get the element's z-index value
      let computedStyle = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue("z-index");
      let zindex = Number(!isNaN(computedStyle) || elements[i].style.zIndex === "" ? 0 : elements[i].style.zIndex);

      // Save the z-index value if it's the highest so far
      if(zindex > highest && zindex !== 'auto') {
        highest = zindex;
      }

    }

    return highest;

  }

  /**
   * Hide the modal by removing the state classes and unlocking the
   * body, and also update the state object.
   * @return {boolean}
   */
  hide() {

    // Don't run if the modal is already hidden
    if(!this.state.shown) {
      return false;
    }

    this.state.shown = false;

    this.toggleClasses();
    this.toggleAriaHidden();

    return true;

  }

  /**
   * Show the modal by removing the state classes and unlocking the
   * body, and also update the state object.
   * @return {boolean}
   */
  show() {

    // Don't run if the modal is already shown
    if(this.state.shown) {
      return false;
    }

    this.state.shown = true;

    this.toggleClasses();
    this.toggleAriaHidden();

    return true;

  }

  /**
   * Toggle the classes on the body and age gate elements that
   * control the page scroll and the modal visibility. Note: this
   * does not impact the state object and so should not be called
   * directly - use modal.show() and modal.hide() instead.
   * @return {boolean}
   */
  toggleClasses() {

    this.el.body.classList.toggle(styles.sAgBodyIsLocked);
    this.el.curtain.classList.toggle(styles.sAgModalCurtainIsShown);
    this.el.dialog.classList.toggle(styles.sAgModalDialogIsShown);

    return true;

  }

  toggleAriaHidden() {

    this.el.curtain.setAttribute("aria-hidden", !this.state.shown);
    this.el.dialog.setAttribute("aria-hidden", !this.state.shown);

  }

}
