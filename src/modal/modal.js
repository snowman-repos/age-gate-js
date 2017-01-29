import styles from "./modal.css";

// Keep this outside of the main class so that it remains private and
// inaccessible
let allowedMainElements = [
  "content",
  "curtain",
  "dialog"
];

/**
 * Class to create and control a modal window for the age gate; the
 * modal is not shown by default.
 * @param {object} HTMLNode to which the modal will be attached.
 * @constructor
 */
export default class Modal {

  constructor(config) {

    // Save DOM references
    this.el = {
      body: document.body,
      mainElements: this.createMainElements(),
      previouslyFocused: null
    };

    // State object
    this.state = {
      shown: false
    };

    // If the instance has been initialised with a wrapper element specified
    // in a config object, then append the main elements to it, otherwise
    // append the main elements to the body directly
    if(config) {
      this.appendTo(config.wrapper);
    } else {
      this.appendTo(document.body);
    }

  }

  /**
   * Append the main elements to a wrapper element.
   * @param {object} The HTML Node to which main elements should be appended.
   * @return {object} The HTML Node to which main elements have been appended.
   */
  appendTo(parent) {

    if(!parent) {
      return null;
    }

    parent.appendChild(this.el.mainElements.curtain);
    parent.appendChild(this.el.mainElements.dialog);
    this.el.mainElements.dialog.appendChild(this.el.mainElements.content);

    return parent;

  }

  /**
   * Create one of the main elements based on a config object.
   * @param {object} The set of options for creating the element.
   * @return {object} The HTML node for the newly created object.
   */
  createMainElement(config) {

    if(this.mainElementIsNotAllowed(config.name) || this.mainElementsAlreadyExist()) {
      return false;
    }

    let el = document.createElement(config.tagName);
    el.setAttribute("aria-hidden", config.ariaHidden);
    el.classList.add(styles[config.className]);
    el.id = config.id;
    el.setAttribute("role", config.role);
    el.setAttribute("tabindex", config.tabindex);
    el.style.zIndex = config.zindex;

    return(el);

  }

  /**
   *
   */
  createMainElements() {

    if(this.mainElementsAlreadyExist()) {
      return false;
    }

    // Modal elements must be placed above anything else on the page,
    // so find out what the highest element is
    let highestZIndex = this.getHighestZIndex();

    // There are 3 main parts to the modal:
    // - content: a container for the modal content
    // - curtain: a semi-opaque layer that covers the entire screen
    // - dialog: a dialog box that contains the content
    let content, curtain, dialog = null;

    content = this.createMainElement({
      ariaHidden: "true",
      className: "agModalContent",
      id: "ag-modal-content",
      name: "content",
      role: "document",
      tabindex: 0,
      tagName: "div",
      zindex: highestZIndex + 3
    });

    curtain = this.createMainElement({
      ariaHidden: "true",
      className: "agModalCurtain",
      id: "ag-modal-curtain",
      name: "curtain",
      role: "",
      tabindex: -1,
      tagName: "div",
      zindex: highestZIndex + 1
    });

    dialog = this.createMainElement({
      ariaHidden: "true",
      className: "agModalDialog",
      id: "ag-modal-dialog",
      name: "dialog",
      role: "dialog",
      tabindex: -1,
      tagName: "div",
      zindex: highestZIndex + 2
    });

    return {
      content: content,
      curtain: curtain,
      dialog: dialog
    };

  }

  /**
   * Generate the HTML for the required content inside the modal dialog.
   * @param {object} The configuration for the contents.
   * @return {object} The content of the modal dialog.
   */
  generateContents(config) {

    console.log(config);

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
    this.restoreFocus();

    return true;

  }

  /**
   * Check if the main elements have already been created.
   * @return {boolean}
   */
  mainElementsAlreadyExist() {

    return(!!this.el);

  }

  /**
   * Check if a main element may be created.
   * @param {string} The name of the element.
   * @return {boolean}
   */
  mainElementIsNotAllowed(name) {

    return(allowedMainElements.indexOf(name) === -1);

  }

  /**
   * If any element was in focus before the modal was opened then restore
   * focus to that element.
   * @return {boolean}
   */
  restoreFocus() {

    if(this.el.previouslyFocused.tagName === "BODY" ||
     this.el.previouslyFocused.id === "ag-modal-content") {

      document.activeElement.blur();

    } else {

      this.el.previouslyFocused.focus();

    }

    return true;

  }

  /**
   * Save a reference to any currently focused element and give focus to the
   * modal content
   * @return {boolean}
   */
  setFocus() {

    this.el.previouslyFocused = document.activeElement;
    this.el.mainElements.content.focus();

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
    this.setFocus();

    return true;

  }

  /**
   * Toggle the classes on the body and main elements that
   * control the page scroll and the modal visibility. Note: this
   * does not impact the state object and so should not be called
   * directly - use modal.show() and modal.hide() instead.
   * @return {boolean}
   */
  toggleClasses() {

    this.el.body.classList.toggle(styles.sAgBodyIsLocked);
    this.el.mainElements.content.classList.toggle(styles.sAgModalContentIsShown);
    this.el.mainElements.curtain.classList.toggle(styles.sAgModalCurtainIsShown);
    this.el.mainElements.dialog.classList.toggle(styles.sAgModalDialogIsShown);

    return true;

  }

  /**
   * Toggle the aria-hiden attribute on the main elements.
   * @return {boolean}
   */
  toggleAriaHidden() {

    this.el.mainElements.content.setAttribute("aria-hidden", !this.state.shown);
    this.el.mainElements.curtain.setAttribute("aria-hidden", !this.state.shown);
    this.el.mainElements.dialog.setAttribute("aria-hidden", !this.state.shown);

    return true;

  }

}
