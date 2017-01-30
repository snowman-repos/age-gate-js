import styles from "./modal.css";
import ModalContent from "./content/modal-content";

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

    // for each content element required
    for(var key in config) {
      if(config.hasOwnProperty(key)) {

        let el = null;

        // generate the appropriate markup for that element
        switch(key) {
          case "title":
            el = this.generateTitle(config[key]);
            break;
          case "intro":
            el = this.generateIntro(config[key]);
            break;
          case "image":
            el = this.generateImage(config[key]);
            break;
          case "radio":
            el = this.generateRadio(config[key]);
            break;
          case "dateOfBirth":
            el = this.generateDateOfBirth(config[key]);
            break;
          case "checkboxes":
            el = this.generateCheckboxes(config[key]);
            break;
          case "country":
            el = this.generateCountry(config[key]);
            break;
          case "language":
            el = this.generateLanguage(config[key]);
            break;
          case "button":
            el = this.generateButton(config[key]);
            break;
          case "disclaimer":
            el = this.generateDisclaimer(config[key]);
            break;
        }

        // append the element to the modal content
        this.el.mainElements.content.appendChild(el);

      }
    }

    return this.el.mainElements.content;

  }

  /**
   * Generates an HTML node for a container row inside the modal content.
   * @return {object}
   */
  generateContainer() {

    let container = document.createElement("div");
    container.classList.add(styles.agModalContentRow);
    return container;

  }

  /**
   * Generates an HTML node for a column inside a row in the modal content.
   * @return {object}
   */
  generateSubContainer() {

    let container = document.createElement("div");
    container.classList.add(styles.agModalContentColumn);
    return container;

  }

  /**
   * Generates the HTML node for the title row inside the modal content.
   * @param {object} The configuration for the title.
   * @return {object}
   */
  generateTitle(config) {

    let container = this.generateContainer();

    config.id = "ag-title"
    config.tagName = "h1";

    container.appendChild(new ModalContent(config));

    return container;

  }

  /**
   * Generates the HTML node for the intro row inside the modal content.
   * @param {object} The configuration for the intro.
   * @return {object}
   */
  generateIntro(config) {

    let container = this.generateContainer();

    config.id = "ag-intro";
    config.tagName = "p";

    container.appendChild(new ModalContent(config));

    return container;

  }

  /**
   * Generates the HTML node for the image row inside the modal content.
   * @param {object} The configuration for the image.
   * @return {object}
   */
  generateImage(config) {

    let container = this.generateContainer();

    config.id = "ag-image";
    config.tagName = "img";

    container.appendChild(new ModalContent(config));

    return container;

  }

  /**
   * Generates the HTML node for the radio buttons row inside the modal content.
   * @param {object} The configuration for the radio buttons.
   * @return {object}
   */
  generateRadio(config) {

    let container = this.generateContainer();

    let subContainer = this.generateSubContainer();

    config.yes = config.yes || {};

    config.yes.id = "ag-radio-button--yes";
    config.yes.tagName = "input";
    config.yes.attributes = config.yes.attributes || {};
    config.yes.attributes.name = "radio";
    config.yes.attributes.type = "radio";
    config.yes.attributes.value = "yes";

    subContainer.appendChild(new ModalContent(config.yes));

    config.yes.id = "ag-radio-label--yes";
    config.yes.tagName = "label";
    config.yes.attributes = {};
    config.yes.attributes.for = "ag-radio-label--yes";
    config.yes.content = config.yes.content || "Yes, I am of legal age.";

    subContainer.appendChild(new ModalContent(config.yes));

    container.appendChild(subContainer);

    subContainer = this.generateSubContainer();

    config.no = config.no || {};

    config.no.id = "ag-radio-button--no";
    config.no.tagName = "input";
    config.no.attributes = config.no.attributes || {};
    config.no.attributes.name = "radio";
    config.no.attributes.type = "radio";
    config.no.attributes.value = "no";

    subContainer.appendChild(new ModalContent(config.no));

    config.no.id = "ag-radio-label--no";
    config.no.tagName = "label";
    config.no.attributes = {};
    config.no.attributes.for = "ag-radio-label--no";
    config.no.content = config.no.content || "No, I am not of legal age.";

    subContainer.appendChild(new ModalContent(config.no));

    container.appendChild(subContainer);

    return container;

  }

  /**
   * Generates the HTML node for the date of birth input row inside the modal
   * content.
   * @param {object} The configuration for the date of birth input.
   * @return {object}
   */
  generateDateOfBirth(config) {

    let container = this.generateContainer();

    config.day = config.day || {};
    config.month = config.month || {};
    config.year = config.year || {};

    container.appendChild(this.generateDay(config.day));
    container.appendChild(this.generateDay(config.month));
    container.appendChild(this.generateDay(config.year));

    return container;

  }

  /**
   * Generates an HTML node for the day input column inside the date of birth
   * row in the modal content.
   * @param {object} The configuration for the day input.
   * @return {object}
   */
  generateDay(config) {

    let subContainer = this.generateSubContainer();

    config.label = config.label || {};

    config.label.id = "ag-dob-day-label";
    config.label.tagName = "label";
    config.label.attributes = config.label.attributes || {};
    config.label.attributes.for = "ag-dob-day";

    subContainer.appendChild(new ModalContent(config.label));

    config.input = config.input || {};

    config.input.id = "ag-dob-day";
    config.input.tagName = "input";
    config.input.attributes = config.input.attributes || {};
    config.input.attributes.name = "day";
    config.input.attributes.placeholder = "Day";
    config.input.attributes.type = "text";

    subContainer.appendChild(new ModalContent(config.input));

    return subContainer;

  }

  /**
   * Generates an HTML node for the month input column inside the date of birth
   * row in the modal content.
   * @param {object} The configuration for the month input.
   * @return {object}
   */
  generateMonth(config) {

    let subContainer = this.generateSubContainer();

    config.label = config.label || {};

    config.label.id = "ag-dob-month-label";
    config.label.tagName = "label";
    config.label.attributes = config.label.attributes || {};
    config.label.attributes.for = "ag-month-day";

    subContainer.appendChild(new ModalContent(config.label));

    config.input = config.input || {};

    config.input.id = "ag-dob-month";
    config.input.tagName = "input";
    config.input.attributes = config.input.attributes || {};
    config.input.attributes.name = "month";
    config.input.attributes.placeholder = "Month";
    config.input.attributes.type = "text";

    subContainer.appendChild(new ModalContent(config.input));

    return subContainer;

  }

  /**
   * Generates an HTML node for the year input column inside the date of birth
   * row in the modal content.
   * @param {object} The configuration for the year input.
   * @return {object}
   */
  generateYear(config) {

    let subContainer = this.generateSubContainer();

    config.label = config.label || {};

    config.label.id = "ag-dob-year-label";
    config.label.tagName = "label";
    config.label.attributes = config.label.attributes || {};
    config.label.attributes.for = "ag-dob-year";

    subContainer.appendChild(new ModalContent(config.label));

    config.input = config.input || {};

    config.input.id = "ag-dob-year";
    config.input.tagName = "input";
    config.input.attributes = config.input.attributes || {};
    config.input.attributes.name = "year";
    config.input.attributes.placeholder = "Year";
    config.input.attributes.type = "text";

    subContainer.appendChild(new ModalContent(config.input));

    return subContainer;

  }

  /**
   * Generates an HTML node for the checkboxes row inside the modal content.
   * @param {object} The configuration for the checkboxes.
   * @return {object}
   */
  generateCheckboxes(config) {

    let container = document.createElement("div");

    for(let i = 0; i < config.length; i++) {
      container.appendChild(this.generateCheckbox(config[i], i));
    }

    return container;

  }

  /**
   * Generates an HTML node for a single checkbox row inside the checkboxes row
   * in the modal content.
   * @param {object} The configuration for the checkbox.
   * @return {object}
   */
  generateCheckbox(config, index) {

    let container = document.createElement("label");
    container.setAttribute("for", "ag-checkbox-" + index);

    config.input = config.input || {};

    config.input.id = "ag-checkbox-" + index;
    config.input.tagName = "input";
    config.input.attributes = config.input.attributes || {};
    config.input.attributes.name = "checkbox-" + index;
    config.input.attributes.type = "checkox";

    container.appendChild(new ModalContent(config.input));

    config.label = config.label || {};

    config.label.id = "ag-checkbox-" + index + "-label";
    config.label.tagName = "span";

    container.appendChild(new ModalContent(config));

    return container;

  }

  /**
   * Generates an HTML node for the country input row inside the modal content.
   * @param {object} The configuration for the country input.
   * @return {object}
   */
  generateCountry(config) {

    let container = this.generateContainer();

    config.label = config.label || {};

    config.label.id = "ag-country-label";
    config.label.tagName = "label";
    config.label.attributes = config.label.attributes || {};
    config.label.attributes.for = "ag-country";
    config.label.content = config.label.content || "Select the country you are in:";

    container.appendChild(new ModalContent(config.label));

    config.input = config.input || {};

    config.input.id = "ag-country";
    config.input.tagName = "select";
    config.input.content = this.generateCountriesContent(config.input.content);

    container.appendChild(new ModalContent(config.input));

    return container;

  }

  /**
   * Generates the HTML content for each country option in the country input.
   * @param {object} The configuration countries list.
   * @return {string}
   */
  generateCountriesContent(countries) {

    let select = document.createElement("select");

    for(var country in countries) {

      let option = document.createElement("option");
      option.setAttribute("value", country);
      option.innerHTML = countries[country];
      select.appendChild(option);

    }

    return select.innerHTML;

  }

  /**
   * Generates an HTML node for the country input row inside the modal content.
   * @param {object} The configuration for the language input.
   * @return {object}
   */
  generateLanguage(config) {

    let container = this.generateContainer();

    config.label = config.label || {};

    config.label.id = "ag-language-label";
    config.label.tagName = "label";
    config.label.attributes = config.label.attributes || {};
    config.label.attributes.for = "ag-language";
    config.label.content = config.label.content || "Select your language:";

    container.appendChild(new ModalContent(config.label));

    config.input = config.input || {};

    config.input.id = "ag-language";
    config.input.tagName = "select";
    config.input.content = this.generateLanguagesContent(config.input.content);

    container.appendChild(new ModalContent(config.input));

    return container;

  }

  /**
   * Generates the HTML content for each language option in the language input.
   * @param {object} The configuration languages list.
   * @return {string}
   */
  generateLanguagesContent(languages) {

    let select = document.createElement("select");

    for(var language in languages) {

      let option = document.createElement("option");
      option.setAttribute("value", language);
      option.innerHTML = languages[language];
      select.appendChild(option);

    }

    return select.innerHTML;

  }

  /**
   * Generates an HTML node for the button row inside the modal content.
   * @param {object} The configuration for the button.
   * @return {object}
   */
  generateButton(config) {

    let container = this.generateContainer();

    config.id = "ag-button";
    config.tagName = "button";

    container.appendChild(new ModalContent(config));

    return container;

  }

  /**
   * Generates an HTML node for the disclaimer row inside the modal content.
   * @param {object} The configuration for the disclaimer.
   * @return {object}
   */
  generateDisclaimer(config) {

    let container = this.generateContainer();

    config.id = "ag-disclaimer";
    config.tagName = "div";

    container.appendChild(new ModalContent(config));

    return container;

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
